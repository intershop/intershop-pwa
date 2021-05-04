import { createReducer, on } from '@ngrx/store';

import { ContentPageTreeHelper } from 'ish-core/models/content-page-tree/content-page-tree.helper';
import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';

import { loadContentPageTreeSuccess } from './page-tree.actions';

export interface PageTreeState {
  pagetree: ContentPageTree;
}

const initialState: PageTreeState = {
  pagetree: ContentPageTreeHelper.empty(),
};

function mergePageTrees(state: PageTreeState, action: ReturnType<typeof loadContentPageTreeSuccess>) {
  const pagetree = action.payload.pagetree;
  return pagetree
    ? {
        ...state,
        pagetree: ContentPageTreeHelper.merge(state.pagetree, pagetree),
      }
    : { ...state };
}

export const pageTreeReducer = createReducer(initialState, on(loadContentPageTreeSuccess, mergePageTrees));
