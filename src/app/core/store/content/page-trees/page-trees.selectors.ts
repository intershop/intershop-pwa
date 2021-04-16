import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import {
  ContentPageletTreeView,
  createContentPageletTreeView,
} from 'ish-core/models/content-pagelet-tree-view/content-pagelet-tree-view.model';
import { ContentPageletTree } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.model';
import { getContentState } from 'ish-core/store/content/content-store';

const getPageTreesState = createSelector(getContentState, state => state.trees);

export const getPageTrees = createSelector(getPageTreesState, state => state.trees);

/**
 *
 * @param contentPageId: The Id of Page
 * @returns Content page tree view of given page
 */
export const getContentPageTreeView = (uniqueId: string) =>
  createSelectorFactory<object, ContentPageletTreeView>(projector => resultMemoize(projector, isEqual))(
    getPageTrees,
    (tree: ContentPageletTree) => createContentPageletTreeView(tree, uniqueId)
  );
