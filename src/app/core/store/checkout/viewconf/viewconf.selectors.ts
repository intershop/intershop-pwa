import { createSelector } from '@ngrx/store';

import { getCheckoutState } from 'ish-core/store/checkout/checkout-store';

const getViewconfState = createSelector(
  getCheckoutState,
  state => state.viewconf
);

export const getCheckoutStep = createSelector(
  getViewconfState,
  state => state.checkoutStep
);
