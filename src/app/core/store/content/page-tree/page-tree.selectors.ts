import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import {
  ContentPageTreeView,
  createContentPageTreeView,
} from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
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
