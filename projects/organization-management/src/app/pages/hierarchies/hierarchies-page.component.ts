import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { TreeItem, TreeviewComponent, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { Group, GroupTree } from '../../models/group/group.model';

@Component({
  selector: 'ish-hierarchies-page',
  templateUrl: './hierarchies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchiesPageComponent implements OnInit {
  @ViewChild('ngx-treeview') treeViewComponent: TreeviewComponent;
  items$: Observable<TreeviewItem[]>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  config: TreeviewConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
  });

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.items$ = this.organizationManagementFacade.groups$().pipe(
      map(groupTree => this.mapToTreeItems(groupTree, groupTree.rootIds)),
      map(items => items.map(item => new TreeviewItem(item)))
    );
    this.error$ = this.organizationManagementFacade.groupsError$;
    this.loading$ = this.organizationManagementFacade.groupsLoading$;
  }

  mapTreeViewItem(orgGroup: Group): TreeItem {
    return {
      text: orgGroup.name ?? 'unknown',
      value: orgGroup,
      collapsed: false,
      children: [],
      checked: false,
      disabled: false,
    };
  }

  mapToTreeItems(groupTree: GroupTree, rootIds: string[]): TreeItem[] {
    return rootIds
      .map(rootId => groupTree.groups[rootId])
      .map(root => this.traverse(groupTree, root, this.mapTreeViewItem(root)));
  }

  traverse(groupTree: GroupTree, parent: Group, viewItem: TreeItem): TreeItem {
    if (!groupTree.edges[parent.id]) {
      return viewItem;
    }
    return groupTree.edges[parent.id]
      .map(id => groupTree.groups[id])
      .map(group => this.traverse(groupTree, group, this.mapTreeViewItem(group)))
      .reduce((prev, current) => {
        prev.children.push(current);
        return prev;
      }, viewItem);
  }
}
