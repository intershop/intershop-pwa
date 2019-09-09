import { createSelector } from '@ngrx/store';

import { getCoreState } from 'ish-core/store/core-store';

export const getErrorState = createSelector(
  getCoreState,
  state => (state.error && state.error.type ? state.error : undefined)
);
