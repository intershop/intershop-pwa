import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  loadViewContextEntrypoint,
  loadViewContextEntrypointFail,
  loadViewContextEntrypointSuccess,
} from './viewcontexts.actions';

export const viewcontextsAdapter = createEntityAdapter<ContentPageletEntryPoint>({
  selectId: viewcontext => viewcontext.clientId,
});

export interface ViewcontextsState extends EntityState<ContentPageletEntryPoint> {
  loading: boolean;
}

export const initialState: ViewcontextsState = viewcontextsAdapter.getInitialState({
  loading: false,
});

export const viewcontextsReducer = createReducer(
  initialState,
  setLoadingOn(loadViewContextEntrypoint),
  on(loadViewContextEntrypointFail, (state: ViewcontextsState) => ({
    ...state,
    loading: false,
  })),
  on(loadViewContextEntrypointSuccess, (state: ViewcontextsState, action) => {
    const { entrypoint } = action.payload;

    return {
      ...viewcontextsAdapter.upsertOne(entrypoint, state),
      loading: false,
    };
  })
);
