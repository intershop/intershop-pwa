import { createAction, createReducer, on } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

export const setMatomoTrackerUrl = createAction(
  '[Configuration] Set Matomo trackerUrl',
  payload<{ trackerUrl: string }>()
);

export const setMatomoSiteId = createAction('[Configuration] Set Matomo siteId', payload<{ siteId: string }>());

export const matomoTrackerReducer = createReducer(
  undefined,
  on(setMatomoTrackerUrl, (_, action): string => action.payload.trackerUrl)
);

export const matomoSiteIdReducer = createReducer(
  undefined,
  on(setMatomoSiteId, (_, action): string => action.payload.siteId)
);
