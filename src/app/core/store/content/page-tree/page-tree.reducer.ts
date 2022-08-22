import { createReducer, on } from '@ngrx/store';

import { ContentPageTreeHelper } from 'ish-core/models/content-page-tree/content-page-tree.helper';
import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-tree.actions';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

export interface PageTreeState {
  pagetree: ContentPageTree;
  loading: boolean;
  error: HttpError;
}

const initialState: PageTreeState = {
  pagetree: ContentPageTreeHelper.empty(),
  loading: false,
  error: undefined,
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

export const pageTreeReducer = createReducer(
  initialState,
  setLoadingOn(loadContentPageTree),
  unsetLoadingAndErrorOn(loadContentPageTreeSuccess),
  setErrorOn(loadContentPageTreeFail),
  on(loadContentPageTreeSuccess, mergePageTrees)
);
