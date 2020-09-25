import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { TreeItem, TreeviewComponent, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { Node, NodeTree } from '../../models/node/node.model';

@Component({
  selector: 'ish-hierarchies-page',
  templateUrl: './hierarchies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchiesPageComponent implements OnInit {
  @ViewChild('ngx-treeview') treeViewComponent: TreeviewComponent;
  items$: Observable<TreeviewItem[]>;
  error$: Observable<HttpError>;
  config: TreeviewConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
  });

  constructor(private organizationManagement: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.items$ = this.organizationManagement.groups$().pipe(
      map(nodeTree => this.mapToTreeItems(nodeTree, nodeTree.rootIds)),
      map(items => items.map(item => new TreeviewItem(item)))
    );
    this.error$ = this.organizationManagement.groupsError$;
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
    return rootIds
      .map(rootId => nodeTree.nodes[rootId])
      .map(root => this.traverse(nodeTree, root, this.mapTreeViewItem(root)));
  }

  traverse(nodeTree: NodeTree, parent: Node, viewItem: TreeItem): TreeItem {
    if (!nodeTree.edges[parent.id]) {
      return viewItem;
    }
    return nodeTree.edges[parent.id]
      .map(id => nodeTree.nodes[id])
      .map(node => this.traverse(nodeTree, node, this.mapTreeViewItem(node)))
      .reduce((prev, current) => {
        prev.children.push(current);
        return prev;
      }, viewItem);
  }
}
