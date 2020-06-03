import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { AccountState } from './account-store';
import { AddressesEffects } from './addresses/addresses.effects';
import { addressesReducer } from './addresses/addresses.reducer';
import { BasketAddressesEffects } from './basket/basket-addresses.effects';
import { BasketItemsEffects } from './basket/basket-items.effects';
import { BasketPaymentEffects } from './basket/basket-payment.effects';
import { BasketPromotionCodeEffects } from './basket/basket-promotion-code.effects';
import { BasketValidationEffects } from './basket/basket-validation.effects';
import { BasketEffects } from './basket/basket.effects';
import { basketReducer } from './basket/basket.reducer';
import { OrdersEffects } from './orders/orders.effects';
import { ordersReducer } from './orders/orders.reducer';
import { RestoreEffects } from './restore/restore.effects';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';

const accountReducers: ActionReducerMap<AccountState> = {
  user: userReducer,
  addresses: addressesReducer,
  orders: ordersReducer,
  basket: basketReducer,
};

const accountEffects = [
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
  imports: [EffectsModule.forFeature(accountEffects), StoreModule.forFeature('_account', accountReducers)],
})
export class AccountStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<AccountState>)[]) {
    return StoreModule.forFeature('_account', pick(accountReducers, reducers));
  }
}
