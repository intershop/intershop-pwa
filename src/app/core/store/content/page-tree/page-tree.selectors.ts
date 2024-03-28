import { createSelector, createSelectorFactory, defaultMemoize, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import {
  ContentPageTreeView,
  createCompleteContentPageTreeView,
  createContentPageTreeView,
} from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageTreeHelper } from 'ish-core/models/content-page-tree/content-page-tree.helper';
import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { getContentState } from 'ish-core/store/content/content-store';
import { selectRouteParam } from 'ish-core/store/core/router';

const getPageTreeState = createSelector(getContentState, state => state.pagetree);

export const getPageTree = createSelector(getPageTreeState, state => state.pagetree);

/**
 * Get the content page tree for the given root and the currently selected content page.
 *
 * @param rootId  The Id of the root content page of the tree
 * @returns       The fitting content page tree
 */
export const getContentPageTree = (rootId: string) =>
  createSelectorFactory<object, ContentPageTreeView>(projector => resultMemoize(projector, isEqual))(
    getPageTree,
    selectRouteParam('contentPageId'),
    (pagetree: ContentPageTree, contentPageId: string) => createContentPageTreeView(pagetree, rootId, contentPageId)
  );

/**
 * Get the complete content page tree (all branches) for the given root to the given depth.
 *
 * @param rootId  The Id of the root content page of the tree
 * @returns       The complete content page tree
 */
export const getCompleteContentPageTree = (rootId: string, depth: number) =>
  createSelectorFactory<object, ContentPageTreeView>(projector =>
    defaultMemoize(projector, ContentPageTreeHelper.equals, isEqual)
  )(getPageTree, (tree: ContentPageTree): ContentPageTreeView => {
    if (!rootId) {
      return;
    }
    return createCompleteContentPageTreeView(ContentPageTreeHelper.subTree(tree, rootId), rootId, depth);
  });
