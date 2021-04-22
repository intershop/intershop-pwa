import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import {
  ContentPageTreeView,
  createContentPageTreeView,
} from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { getContentState } from 'ish-core/store/content/content-store';
import { selectRouteParam } from 'ish-core/store/core/router';

const getPageTreesState = createSelector(getContentState, state => state.trees);

export const getPageTrees = createSelector(getPageTreesState, state => state.trees);

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
