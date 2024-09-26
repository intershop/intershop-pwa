import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
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
import { DataRequestsEffects } from './data-requests/data-requests.effects';
import { dataRequestsReducer } from './data-requests/data-requests.reducer';
import { OrdersEffects } from './orders/orders.effects';
import { ordersReducer } from './orders/orders.reducer';
import { OrganizationManagementEffects } from './organization-management/organization-management.effects';
import { RecurringOrdersEffects } from './recurring-orders/recurring-orders.effects';
import { recurringOrdersReducer } from './recurring-orders/recurring-orders.reducer';
import { RequisitionManagementEffects } from './requisition-management/requisition-management.effects';
import { SsoRegistrationEffects } from './sso-registration/sso-registration.effects';
import { ssoRegistrationReducer } from './sso-registration/sso-registration.reducer';
import { UserNewsletterEffects } from './user/user-newsletter.effects';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';

const customerReducers: ActionReducerMap<CustomerState> = {
  user: userReducer,
  addresses: addressesReducer,
  orders: ordersReducer,
  recurringOrders: recurringOrdersReducer,
  basket: basketReducer,
  authorization: authorizationReducer,
  ssoRegistration: ssoRegistrationReducer,
  dataRequests: dataRequestsReducer,
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
  RecurringOrdersEffects,
  UserEffects,
  AuthorizationEffects,
  OrganizationManagementEffects,
  RequisitionManagementEffects,
  SsoRegistrationEffects,
  DataRequestsEffects,
  UserNewsletterEffects,
];

@Injectable()
export class CustomerStoreConfig implements StoreConfig<CustomerState> {
  metaReducers = [resetOnLogoutMeta];
}

export const CUSTOMER_STORE_CONFIG = new InjectionToken<StoreConfig<CustomerState>>('customerStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(customerEffects),
    StoreModule.forFeature('_customer', customerReducers, CUSTOMER_STORE_CONFIG),
  ],
  providers: [{ provide: CUSTOMER_STORE_CONFIG, useClass: CustomerStoreConfig }],
})
export class CustomerStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CustomerState>)[]) {
    return StoreModule.forFeature('_customer', pick(customerReducers, reducers));
  }

  /**
   * Customer_STORE_CONFIG needs to be provided in test
   * @example
   * { provide: CUSTOMER_STORE_CONFIG, useClass: CustomerStoreConfig }
   */
  static forTestingWithMetaReducer(...reducers: (keyof ActionReducerMap<CustomerState>)[]) {
    return StoreModule.forFeature('_customer', pick(customerReducers, reducers), CUSTOMER_STORE_CONFIG);
  }
}
