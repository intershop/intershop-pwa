import { createSelector } from '@ngrx/store';

import { getSparqueState } from '../sparque-store';

export const getSparqueConfig = createSelector(getSparqueState, state => state?.sparqueConfig);

export const getSparqueConfigEndpoint = createSelector(getSparqueConfig, config => config?.endPoint);
//export const getSparqueConfigEndpoint = createSelector(getSparqueState, state => state?.sparqueConfig?.endPoint);

