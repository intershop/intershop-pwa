import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { loadContentIncludeSuccess } from 'ish-core/store/content/includes/includes.actions';
import { loadContentPageSuccess } from 'ish-core/store/content/pages/pages.actions';

export interface PageletsState extends EntityState<ContentPagelet> {}

export const pageletsAdapter = createEntityAdapter<ContentPagelet>();

const initialState = pageletsAdapter.getInitialState();

export const pageletsReducer = createReducer(
  initialState,
  on(loadContentIncludeSuccess, (state: PageletsState, action) =>
    pageletsAdapter.upsertMany(action.payload.pagelets, state)
  ),
  on(loadContentPageSuccess, (state: PageletsState, action) =>
    pageletsAdapter.upsertMany(action.payload.pagelets, state)
  )
);
