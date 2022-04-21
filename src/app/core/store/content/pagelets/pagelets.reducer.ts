import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { loadContentIncludeSuccess } from 'ish-core/store/content/includes/includes.actions';
import { loadContentPageSuccess } from 'ish-core/store/content/pages/pages.actions';
import { loadViewContextEntrypointSuccess } from 'ish-core/store/content/viewcontexts/viewcontexts.actions';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { loadPagelet, loadPageletFail, loadPageletSuccess } from './pagelets.actions';

export const pageletsAdapter = createEntityAdapter<ContentPagelet>();

export interface PageletsState extends EntityState<ContentPagelet> {
  loading: boolean;
  error: HttpError;
}

const initialState: PageletsState = pageletsAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const pageletsReducer = createReducer(
  initialState,
  on(loadContentIncludeSuccess, (state, action) => pageletsAdapter.upsertMany(action.payload.pagelets, state)),
  on(loadContentPageSuccess, (state, action) => pageletsAdapter.upsertMany(action.payload.pagelets, state)),
  on(loadViewContextEntrypointSuccess, (state, action) => pageletsAdapter.upsertMany(action.payload.pagelets, state)),
  setLoadingOn(loadPagelet),
  setErrorOn(loadPageletFail),
  unsetLoadingAndErrorOn(loadPageletSuccess),
  on(loadPageletSuccess, (state, action) => pageletsAdapter.upsertOne(action.payload.pagelet, state))
);
