import { createSelector } from '@ngrx/store';

import { getGeneralState } from 'ish-core/store/general/general-store';

const getContactState = createSelector(getGeneralState, state => state.contact);

export const getContactSubjects = createSelector(getContactState, state => state.subjects);

export const getContactLoading = createSelector(getContactState, state => state.loading);

export const getContactSuccess = createSelector(getContactState, state => state.success);
