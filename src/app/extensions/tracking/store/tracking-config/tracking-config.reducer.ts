import { createReducer, on } from '@ngrx/store';

import { setGTMToken } from './tracking-config.actions';

export const trackingConfigReducer = createReducer<string>(
  undefined,
  on(setGTMToken, (_, action): string => action.payload.gtmToken)
);
