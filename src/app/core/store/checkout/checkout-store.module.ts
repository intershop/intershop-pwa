import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { BasketAddressesEffects } from './basket/basket-addresses.effects';
import { BasketItemsEffects } from './basket/basket-items.effects';
import { BasketPaymentEffects } from './basket/basket-payment.effects';
import { BasketPromotionCodeEffects } from './basket/basket-promotion-code.effects';
import { BasketValidationEffects } from './basket/basket-validation.effects';
import { BasketEffects } from './basket/basket.effects';
import { basketReducer } from './basket/basket.reducer';
import { CheckoutState } from './checkout-store';

/** @deprecated will be made private in version 0.23 */
export const checkoutReducers: ActionReducerMap<CheckoutState> = {
  basket: basketReducer,
};

/** @deprecated will be made private in version 0.23 */
export const checkoutEffects = [
  BasketEffects,
  BasketAddressesEffects,
  BasketItemsEffects,
  BasketValidationEffects,
  BasketPaymentEffects,
  BasketPromotionCodeEffects,
];
// tslint:disable: deprecation

@NgModule({
  imports: [EffectsModule.forFeature(checkoutEffects), StoreModule.forFeature('checkout', checkoutReducers)],
})
export class CheckoutStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CheckoutState>)[]) {
    return StoreModule.forFeature('checkout', pick(checkoutReducers, reducers));
  }
}
