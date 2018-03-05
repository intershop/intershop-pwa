import { createSelector } from '@ngrx/store';
import { CoreState } from '../core.state';
import { getCurrent } from './error.reducer';

const getErrorState = (state: CoreState) => state.error;

export const getCurrentError = createSelector(getErrorState, getCurrent);

