import { createSelector } from '@ngrx/store';
import { getCheckoutState } from '../checkout.state';

const getViewconfState = createSelector(getCheckoutState, state => state.viewconf);

export const getCheckoutStep = createSelector(getViewconfState, state => state.checkoutStep);
