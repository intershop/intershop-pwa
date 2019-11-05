import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import {
  ContentPageletEntryPointView,
  createContentPageletEntryPointView,
} from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';

import { viewcontextsAdapter } from './viewcontexts.reducer';

const getViewcontextsState = createSelector(getContentState, state => state.viewcontexts);

export const getViewcontextsLoading = createSelector(getViewcontextsState, state => state.loading);

export const { selectEntities: getViewcontextEntities } = viewcontextsAdapter.getSelectors(getViewcontextsState);

export const getViewcontext = createSelector(
  getViewcontextEntities,
  (viewcontexts: Dictionary<ContentPageletEntryPoint>, viewcontextId: string): ContentPageletEntryPointView =>
    createContentPageletEntryPointView(viewcontexts[viewcontextId])
);
