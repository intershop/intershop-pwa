import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';

import { BasketAddressesEffects } from './basket/basket-addresses.effects';
import { BasketItemsEffects } from './basket/basket-items.effects';
import { BasketPaymentEffects } from './basket/basket-payment.effects';
import { BasketPromotionCodeEffects } from './basket/basket-promotion-code.effects';
import { BasketValidationEffects } from './basket/basket-validation.effects';
import { BasketEffects } from './basket/basket.effects';

const customerBasketEffects = [
  BasketEffects,
  BasketItemsEffects,
  BasketAddressesEffects,
  BasketPaymentEffects,
  BasketPromotionCodeEffects,
  BasketValidationEffects,
];

export function provideCustomerBasketStore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideEffects(customerBasketEffects)]);
}

export class CustomerBasketStoreProviders {}
