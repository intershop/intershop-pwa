import { createReducer, on } from '@ngrx/store';

import { ContentPageTreeHelper } from 'ish-core/models/content-page-tree/content-page-tree.helper';
import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';

import { loadContentPageTreeSuccess } from './page-trees.actions';

export interface PageTreesState {
  pagetrees: ContentPageTree;
}

const initialState: PageTreesState = {
  pagetrees: ContentPageTreeHelper.empty(),
};

function mergePageTrees(state: PageTreesState, action: ReturnType<typeof loadContentPageTreeSuccess>) {
  const pagetree = action.payload.pagetree;
  return pagetree
    ? {
        ...state,
        pagetrees: ContentPageTreeHelper.merge(state.pagetrees, pagetree),
      }
    : { ...state };
}

export const pageTreesReducer = createReducer(initialState, on(loadContentPageTreeSuccess, mergePageTrees));
