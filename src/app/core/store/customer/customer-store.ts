import { createFeatureSelector } from '@ngrx/store';

import { Authorization } from 'ish-core/models/authorization/authorization.model';

import { AddressesState } from './addresses/addresses.reducer';
import { BasketState } from './basket/basket.reducer';
import { DataRequestsState } from './data-requests/data-requests.reducer';
import { OrdersState } from './orders/orders.reducer';
import { RecurringOrdersState } from './recurring-orders/recurring-orders.reducer';
import { SsoRegistrationState } from './sso-registration/sso-registration.reducer';
import { UserState } from './user/user.reducer';

export interface CustomerState {
  user: UserState;
  addresses: AddressesState;
  orders: OrdersState;
  recurringOrders: RecurringOrdersState;
  basket: BasketState;
  authorization: Authorization;
  ssoRegistration: SsoRegistrationState;
  dataRequests: DataRequestsState;
}

export const getCustomerState = createFeatureSelector<CustomerState>('_customer');
