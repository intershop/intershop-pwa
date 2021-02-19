import { createSelector } from '@ngrx/store';

import { getTrackingState } from '../tracking-store';

export const getGTMToken = createSelector(getTrackingState, state => state?.gtmToken);
