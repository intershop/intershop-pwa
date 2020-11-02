import { createSelector } from '@ngrx/store';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { createContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';

import { serializeContextSpecificViewContextId, viewcontextsAdapter } from './viewcontexts.reducer';

const getViewcontextsState = createSelector(getContentState, state => state.viewcontexts);

export const { selectEntities: getViewContextEntities } = viewcontextsAdapter.getSelectors(getViewcontextsState);

const getViewContextMemoized = (viewContextId: string, callParameters: CallParameters) =>
  createSelector(
    getViewContextEntities,
    entities => entities[serializeContextSpecificViewContextId(viewContextId, callParameters)]
  );

export const getViewContext = (viewContextId: string, callParameters: CallParameters) =>
  createSelector(getViewContextMemoized(viewContextId, callParameters), createContentPageletEntryPointView);
