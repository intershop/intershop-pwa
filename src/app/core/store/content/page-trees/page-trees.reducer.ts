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
  const tree = action.payload.tree;
  return tree
    ? {
        ...state,
        trees: ContentPageTreeHelper.merge(state.trees, tree),
      }
    : { ...state };
}

export const pageTreesReducer = createReducer(initialState, on(loadContentPageTreeSuccess, mergePageTrees));
