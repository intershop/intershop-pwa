import { ActionReducerMap } from '@ngrx/store';
import { BasketEffects } from './basket/basket.effects';
import { basketReducer } from './basket/basket.reducer';
import { CheckoutState } from './checkout.state';

export const checkoutReducers: ActionReducerMap<CheckoutState> = {
  basket: basketReducer,
};

// tslint:disable-next-line: no-any
export const checkoutEffects: any[] = [BasketEffects];
