import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import {
  ContentPageTreeView,
  createContentPageTreeView,
} from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { getContentState } from 'ish-core/store/content/content-store';

const getPageTreesState = createSelector(getContentState, state => state.trees);

export const getPageTrees = createSelector(getPageTreesState, state => state.trees);

/**
 *
 * @param contentPageId: The Id of Page
 * @returns Content page tree view of given page
 */
export const getContentPageTreeView = (uniqueId: string) =>
  createSelectorFactory<object, ContentPageTreeView>(projector => resultMemoize(projector, isEqual))(
    getPageTrees,
    (tree: ContentPageTree) => createContentPageTreeView(tree, uniqueId)
  );
