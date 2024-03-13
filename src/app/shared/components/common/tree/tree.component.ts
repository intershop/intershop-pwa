import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, merge, of } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';

import { TREE_FACADE_IMPLEMENTOR, TreeFacade } from 'ish-core/facades/common/tree.facade';
import { DynamicFlatNode } from 'ish-core/utils/tree/tree.interface';

interface CachedDataNodeResponses {
  [id: string]: Omit<DynamicFlatNode, 'level'>[];
}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] {
    // eslint-disable-next-line rxjs/no-subject-value
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  // already fetched data to prevent unnecessary REST calls
  cachedDataNodes: CachedDataNodeResponses = {};

  constructor(private _treeControl: FlatTreeControl<DynamicFlatNode>, private _treeFacade: TreeFacade) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (change.added || change.removed) {
        this.handleTreeControl(change);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  // TODO: implementation?
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect(_: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    (this.getCachedDataNodesElement(node.id)
      ? of(this.getCachedDataNodesElement(node.id))
      : this._treeFacade.getChildren$(node.id).pipe(
          take(1),
          tap(children =>
            this.addCachedDataNodes({
              [node.id]: children,
            })
          )
        )
    ).subscribe(children => {
      const index = this.data.indexOf(node);
      if (!children || index < 0) {
        // If no children, or cannot find the node, no op
        return;
      }

      if (expand) {
        const nodes = children.map<DynamicFlatNode>(child => ({
          ...child,
          level: node.level + 1,
        }));
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        // TODO: what does this line ?
        // eslint-disable-next-line no-empty
        for (let i = index + 1; i < this.data.length && this.data[i].level > node.level; i++, count++) {}
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
    });
  }

  private addCachedDataNodes(data: CachedDataNodeResponses) {
    this.cachedDataNodes = {
      ...this.cachedDataNodes,
      ...data,
    };
  }

  private getCachedDataNodesElement(id: string): Omit<DynamicFlatNode, 'level'>[] {
    return this.cachedDataNodes[id];
  }
}

@Component({
  selector: 'ish-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent implements OnInit, OnDestroy {
  treeControl?: FlatTreeControl<DynamicFlatNode>;

  dataSource?: DynamicDataSource;

  private destroy$ = new Subject<void>();

  //used to get the selected node in the using component
  activeNode: DynamicFlatNode | null = undefined;

  constructor(private injector: Injector, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    // get current in context provided tree service
    const treeFacade = this.injector.get<TreeFacade>(TREE_FACADE_IMPLEMENTOR, undefined);
    if (!treeFacade) {
      console.error('No TREE_SERVICE_IMPLEMENTOR provider instance exists.');
    } else {
      treeFacade
        .initialData$()
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(initialData => {
          this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
          this.dataSource = new DynamicDataSource(this.treeControl, treeFacade);
          this.dataSource.data = initialData;
          this.cdRef.markForCheck();
        });
    }
  }

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  setActiveNode(node: DynamicFlatNode) {
    this.activeNode = node;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
