import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ContentPageletTreeData } from 'ish-core/models/content-pagelet-tree/content-pagelet-tree.interface';
import { setLoadingOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-trees.actions';

export const pageTreesAdapter = createEntityAdapter<ContentPageletTreeData>({
  selectId: tree => tree.link.itemId,
});

export interface PageTreesState extends EntityState<ContentPageletTreeData> {
  loading: boolean;
}

const initialState: PageTreesState = pageTreesAdapter.getInitialState({
  loading: false,
});

export const pageTreesReducer = createReducer(
  initialState,
  setLoadingOn(loadContentPageTree),
  unsetLoadingOn(loadContentPageTreeFail, loadContentPageTreeSuccess),
  on(loadContentPageTreeSuccess, (state, action) => {
    const { tree } = action.payload;

    return {
      ...pageTreesAdapter.upsertOne(tree, state),
    };
  })
);
