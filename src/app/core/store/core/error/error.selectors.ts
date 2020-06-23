import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core/core-store';

const getErrorState = createSelector(getCoreState, state =>
  state.error && state.error.type ? state.error : undefined
);

export const getGeneralError = createSelector(getErrorState, state => state?.current);

export const getGeneralErrorType = createSelector(getErrorState, state => state?.type);
