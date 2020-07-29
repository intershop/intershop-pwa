import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Node, NodeTree } from '../../models/node/node.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { TreeItem, TreeviewComponent, TreeviewConfig, TreeviewItem } from 'ngx-treeview';

@Component({
  selector: 'ish-hierarchies-page',
  templateUrl: './hierarchies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchiesPageComponent implements OnInit {
  @ViewChild('ngx-treeview') treeViewComponent: TreeviewComponent;
  items$: Observable<TreeviewItem[]>;
  config: TreeviewConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 500,
  });

  constructor(private organizationManagement: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.items$ = this.organizationManagement.groups$().pipe(
      map(nodeTree => this.mapToTreeItems(nodeTree, nodeTree.rootIds)),
      map(items => items.map(item => new TreeviewItem(item)))
    );
  }

  mapTreeViewItem(orgNode: Node): TreeItem {
    return {
      text: orgNode.name ?? 'unknown',
      value: orgNode,
      collapsed: false,
      children: [],
      checked: false,
      disabled: false,
    };
  }

  mapToTreeItems(nodeTree: NodeTree, rootIds: string[]): TreeItem[] {
    const ret = new Array<TreeItem>(nodeTree.rootIds.length);
    rootIds
      .map(rootId => nodeTree.nodes[rootId])
      .forEach(root => {
        const bla = this.mapTreeViewItem(root);
        this.traverse(nodeTree, root, bla);
        ret.push(bla);
      });
    return ret;
  }

  traverse(nodeTree: NodeTree, parent: Node, viewItem: TreeItem) {
    if (!nodeTree.edges[parent.id]) {
      return;
    }
    nodeTree.edges[parent.id]
      .map(id => nodeTree.nodes[id])
      .map(node => {
        let bla = this.mapTreeViewItem(node);
        this.traverse(nodeTree, node, bla);
        return bla;
      })
      .reduce((prev, current) => this.merge(prev, current), viewItem);
  }

  merge(prev: TreeItem, current: TreeItem): TreeItem {
    let children = prev.children ?? new Array<TreeviewItem>(1);
    children.push(current);
    return prev;
  }
}
