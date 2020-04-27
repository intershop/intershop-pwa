import { createSelector } from '@ngrx/store';

import { getContactState as getContactFeatureState } from 'ish-core/store/contact/contact-store';

const getContactState = createSelector(
  getContactFeatureState,
  state => state.contact
);

export const getContactSubjects = createSelector(
  getContactState,
  state => state.subjects
);

export const getContactLoading = createSelector(
  getContactState,
  state => state.loading
);

export const getContactSuccess = createSelector(
  getContactState,
  state => state.success
);
