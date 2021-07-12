import { createFeatureSelector } from '@ngrx/store';
import { SpCheckoutState } from './sp-checkout/sp-checkout.reducer';

export interface SpCheckoutsState {
  spcheckout: SpCheckoutState;
}

export const getSpCheckoutState = createFeatureSelector<SpCheckoutsState>('spcheckout');
