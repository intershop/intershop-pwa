import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { AddressesEffects } from './addresses/addresses.effects';
import { addressesReducer } from './addresses/addresses.reducer';
import { BasketAddressesEffects } from './basket/basket-addresses.effects';
import { BasketItemsEffects } from './basket/basket-items.effects';
import { BasketPaymentEffects } from './basket/basket-payment.effects';
import { BasketPromotionCodeEffects } from './basket/basket-promotion-code.effects';
import { BasketValidationEffects } from './basket/basket-validation.effects';
import { BasketEffects } from './basket/basket.effects';
import { basketReducer } from './basket/basket.reducer';
import { CustomerState } from './customer-store';
import { OrdersEffects } from './orders/orders.effects';
import { ordersReducer } from './orders/orders.reducer';
import { RestoreEffects } from './restore/restore.effects';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';

const customerReducers: ActionReducerMap<CustomerState> = {
  user: userReducer,
  addresses: addressesReducer,
  orders: ordersReducer,
  basket: basketReducer,
};

const customerEffects = [
  AddressesEffects,
  BasketAddressesEffects,
  BasketEffects,
  BasketItemsEffects,
  BasketPaymentEffects,
  BasketPromotionCodeEffects,
  BasketValidationEffects,
  OrdersEffects,
  RestoreEffects,
  UserEffects,
];

@NgModule({
  imports: [EffectsModule.forFeature(customerEffects), StoreModule.forFeature('_customer', customerReducers)],
})
export class CustomerStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CustomerState>)[]) {
    return StoreModule.forFeature('_customer', pick(customerReducers, reducers));
  }
}
