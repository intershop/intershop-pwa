import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core-store';

const getErrorState = createSelector(
  getCoreState,
  state => (state.error && state.error.type ? state.error : undefined)
);

export const getGeneralError = createSelector(
  getErrorState,
  state => state && state.current
);

export const getGeneralErrorType = createSelector(
  getErrorState,
  state => state && state.type
);
