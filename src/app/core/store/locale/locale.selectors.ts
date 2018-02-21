import { createSelector } from '@ngrx/store';
import { CoreState } from '../core.state';
import { getLocale } from './locale.reducer';

const getLocaleState = (state: CoreState) => state.locale;

export const getCurrentLocale = createSelector(getLocaleState, getLocale);
