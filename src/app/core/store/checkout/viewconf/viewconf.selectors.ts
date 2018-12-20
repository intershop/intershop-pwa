import { createSelector } from '@ngrx/store';

import { getCheckoutState } from '../checkout-store';

const getViewconfState = createSelector(
  getCheckoutState,
  state => state.viewconf
);

export const getCheckoutStep = createSelector(
  getViewconfState,
  state => state.checkoutStep
);
