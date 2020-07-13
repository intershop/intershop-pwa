import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { AddressesEffects } from './addresses/addresses.effects';
import { addressesReducer } from './addresses/addresses.reducer';
import { AuthorizationEffects } from './authorization/authorization.effects';
import { authorizationReducer } from './authorization/authorization.reducer';
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
import { OrganizationManagementEffects } from './organization-management/organization-management.effects';
import { RequisitionManagementEffects } from './requisition-management/requisition-management.effects';
import { RestoreEffects } from './restore/restore.effects';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';

const customerReducers: ActionReducerMap<CustomerState> = {
  user: userReducer,
  addresses: addressesReducer,
  orders: ordersReducer,
  basket: basketReducer,
  authorization: authorizationReducer,
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
  AuthorizationEffects,
  OrganizationManagementEffects,
  RequisitionManagementEffects,
];

const metaReducers = [resetOnLogoutMeta];

@NgModule({
  imports: [
    EffectsModule.forFeature(customerEffects),
    StoreModule.forFeature('_customer', customerReducers, { metaReducers }),
  ],
})
export class CustomerStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CustomerState>)[]) {
    return StoreModule.forFeature('_customer', pick(customerReducers, reducers), { metaReducers });
  }
}
