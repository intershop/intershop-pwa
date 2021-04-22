import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import {
  ContentPageTreeView,
  createContentPageTreeView,
} from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageTree, ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { getContentState } from 'ish-core/store/content/content-store';
import { selectRouteParam } from 'ish-core/store/core/router';

const getPageTreesState = createSelector(getContentState, state => state.trees);

export const getPageTrees = createSelector(getPageTreesState, state => state.trees);

export const getPageTreeNodes = createSelector(getPageTrees, trees => trees.nodes);

export const getSelectedContentPageBreadcrumbData = createSelector(
  getPageTreeNodes,
  selectRouteParam('contentPageId'),
  (nodes: { [id: string]: ContentPageTreeElement }, contentPageId: string) =>
    nodes[contentPageId]
      ? (nodes[contentPageId].path.map((item, i, path) => ({
          key: nodes[item].name,
          link: i !== path.length - 1 ? `/page/${item}` : undefined,
        })) as BreadcrumbItem[])
      : undefined
);

/**
 *
 * @param root: The Id of Page
 * @returns Content page tree view of given page
 */
export const getContentPageTreeView = (root: string) =>
  createSelectorFactory<object, ContentPageTreeView[]>(projector => resultMemoize(projector, isEqual))(
    getPageTrees,
    selectRouteParam('contentPageId'),
    (tree: ContentPageTree, contentPageId: string) => createContentPageTreeView(tree, root, contentPageId)
  );
