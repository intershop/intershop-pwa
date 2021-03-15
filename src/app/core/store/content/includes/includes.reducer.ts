import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { loadContentInclude, loadContentIncludeFail, loadContentIncludeSuccess } from './includes.actions';

export const includesAdapter = createEntityAdapter<ContentPageletEntryPoint>({
  selectId: contentInclude => contentInclude.id,
});

export interface IncludesState extends EntityState<ContentPageletEntryPoint> {
  loading: boolean;
}

export const initialState: IncludesState = includesAdapter.getInitialState({
  loading: false,
});

export const includesReducer = createReducer(
  initialState,
  setLoadingOn(loadContentInclude),
  on(loadContentIncludeFail, state => ({
    ...state,
    loading: false,
  })),
  on(loadContentIncludeSuccess, (state, action) => {
    const { include } = action.payload;

    return {
      ...includesAdapter.upsertOne(include, state),
      loading: false,
    };
  })
);
