import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { DynamicFlatNode } from 'ish-core/utils/tree/tree.interface';

/**
 * Component for displaying angular material cdk trees @see {@link https://material.angular.io/cdk/tree/overview}.
 * The base data is a list of objects that are extensions of the DynamicFlatNode {@link DynamicFlatNode}.
 * Each object corresponds to a node in the tree.
 *
 * The list must be sorted in the following way:
 *
 * expample tree
 * r __ a __ a1__a1.1
 *   |  |___ a2__a2.1
 *   |        |__a2.2
 *   |
 *   |__b __ b1
 *      |___ b2
 *
 * resulting sort order
 *
 * [r,a,a1,a1.1,a2,a2.1,a2.2,b,b1,b2]
 */
@Component({
  selector: 'ish-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent {
  @Input() baseData$: Observable<DynamicFlatNode[]>;

  treeControl = new FlatTreeControl<DynamicFlatNode>(
    node => node.level,
    node => node.childrenIds?.length > 0
  );
  private destroyRef = inject(DestroyRef);

  extendedNodes = new Map<string, boolean>();

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  getParentNode(node: DynamicFlatNode) {
    let parentNode: DynamicFlatNode;

    this.baseData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => (parentNode = (data as DynamicFlatNode[]).find(d => d.childrenIds.includes(node.id))));
    return parentNode;
  }

  shouldRender(node: DynamicFlatNode) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!this.isExpanded(parent)) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }

  toogleNode(node: DynamicFlatNode) {
    this.isExpanded(node) ? this.collapseNode(node) : this.extendNode(node);
  }

  isExpanded(node: DynamicFlatNode) {
    return this.extendedNodes.has(node.id);
  }

  extendNode(node: DynamicFlatNode) {
    this.extendedNodes.set(node.id, true);
  }

  collapseNode(node: DynamicFlatNode) {
    this.extendedNodes.delete(node.id);
  }
}
