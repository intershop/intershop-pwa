import { createSelector } from '@ngrx/store';

import { getContactUsState } from '../contact-us-store';

import { initialState } from './contact.reducer';

const getContactState = createSelector(getContactUsState, state => state?.contact || initialState);

export const getContactSubjects = createSelector(getContactState, state => state.subjects);

export const getContactLoading = createSelector(getContactState, state => state.loading);

export const getContactSuccess = createSelector(getContactState, state => state.success);
