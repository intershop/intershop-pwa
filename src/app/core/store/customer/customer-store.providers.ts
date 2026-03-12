import {
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  importProvidersFrom,
  makeEnvironmentProviders,
} from '@angular/core';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { addressesReducer } from './addresses/addresses.reducer';
import { authorizationReducer } from './authorization/authorization.reducer';
import { basketReducer } from './basket/basket.reducer';
import { CustomerState } from './customer-store';
import { dataRequestsReducer } from './data-requests/data-requests.reducer';
import { ordersReducer } from './orders/orders.reducer';
import { recurringOrdersReducer } from './recurring-orders/recurring-orders.reducer';
import { ssoRegistrationReducer } from './sso-registration/sso-registration.reducer';
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

@Injectable()
export class CustomerStoreConfig implements StoreConfig<CustomerState> {
  metaReducers = [resetOnLogoutMeta];
}

export const CUSTOMER_STORE_CONFIG = new InjectionToken<StoreConfig<CustomerState>>('customerStoreConfig');

const customerStoreImports = [StoreModule.forFeature('_customer', customerReducers, CUSTOMER_STORE_CONFIG)];

const customerStoreProviders = [{ provide: CUSTOMER_STORE_CONFIG, useClass: CustomerStoreConfig }];

export function provideCustomerStore(): EnvironmentProviders {
  return makeEnvironmentProviders([importProvidersFrom(...customerStoreImports), ...customerStoreProviders]);
}

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
