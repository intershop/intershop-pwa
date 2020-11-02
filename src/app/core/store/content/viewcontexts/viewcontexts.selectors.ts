import { createSelector } from '@ngrx/store';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { createContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';

import { serializeContextSpecificViewContextId, viewcontextsAdapter } from './viewcontexts.reducer';

const getViewcontextsState = createSelector(getContentState, state => state.viewcontexts);

export const getViewcontextsLoading = createSelector(getViewcontextsState, state => state.loading);

export const { selectEntities: getViewcontextEntities } = viewcontextsAdapter.getSelectors(getViewcontextsState);

const getViewcontextInternal = (viewContextId: string, callParameters: CallParameters) =>
  createSelector(
    getViewcontextEntities,
    entities => entities[serializeContextSpecificViewContextId(viewContextId, callParameters)]
  );

export const getViewcontext = (viewContextId: string, callParameters: CallParameters) =>
  createSelector(getViewcontextInternal(viewContextId, callParameters), createContentPageletEntryPointView);
