import { createSelector } from '@ngrx/store';

import { getSpCheckoutState } from '../sp-checkout-store';

export const SpState = createSelector(getSpCheckoutState, state => state.spcheckout);
console.log(SpState);