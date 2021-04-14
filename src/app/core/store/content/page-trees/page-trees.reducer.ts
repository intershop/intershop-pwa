import { createReducer, on } from '@ngrx/store';

import { ContentPageletTreeHelper } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.helper';
import { ContentPageletTree } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.model';
import { setLoadingOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-trees.actions';

export interface PageTreesState {
  trees: ContentPageletTree;
  loading: boolean;
}

export const initialState: PageTreesState = {
  trees: ContentPageletTreeHelper.empty(),
  loading: false,
};

function mergePageletTrees(state: PageTreesState, action: ReturnType<typeof loadContentPageTreeSuccess>) {
  const loadedTree = action.payload.tree;
  const trees = ContentPageletTreeHelper.merge(state.trees, loadedTree);
  return {
    ...state,
    trees,
  };
}

export const pageTreesReducer = createReducer(
  initialState,
  on(loadContentPageTreeSuccess, mergePageletTrees),
  setLoadingOn(loadContentPageTree),
  unsetLoadingOn(loadContentPageTreeFail, loadContentPageTreeSuccess)
);
