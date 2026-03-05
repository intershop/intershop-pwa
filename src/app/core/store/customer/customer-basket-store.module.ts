import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { BasketAddressesEffects } from './basket/basket-addresses.effects';
import { BasketItemsEffects } from './basket/basket-items.effects';
import { BasketPaymentEffects } from './basket/basket-payment.effects';
import { BasketPromotionCodeEffects } from './basket/basket-promotion-code.effects';
import { BasketValidationEffects } from './basket/basket-validation.effects';
import { BasketEffects } from './basket/basket.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      BasketEffects,
      BasketItemsEffects,
      BasketAddressesEffects,
      BasketPaymentEffects,
      BasketPromotionCodeEffects,
      BasketValidationEffects,
    ]),
  ],
})
export class CustomerBasketStoreModule {}
