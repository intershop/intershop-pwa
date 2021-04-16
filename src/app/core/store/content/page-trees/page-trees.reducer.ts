import { createReducer, on } from '@ngrx/store';

import { ContentPageTreeHelper } from 'ish-core/models/content-page-tree/content-page-tree.helper';
import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';

import { loadContentPageTreeSuccess } from './page-trees.actions';

export interface PageTreesState {
  trees: ContentPageTree;
}

export const initialState: PageTreesState = {
  trees: ContentPageTreeHelper.empty(),
};

function mergePageTrees(state: PageTreesState, action: ReturnType<typeof loadContentPageTreeSuccess>) {
  const loadedTree = action.payload.tree;
  const trees = ContentPageTreeHelper.merge(state.trees, loadedTree);
  return {
    ...state,
    trees,
  };
}

export const pageTreesReducer = createReducer(initialState, on(loadContentPageTreeSuccess, mergePageTrees));
