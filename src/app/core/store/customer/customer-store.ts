import { createFeatureSelector } from '@ngrx/store';

import { Authorization } from 'ish-core/models/authorization/authorization.model';

import { AddressesState } from './addresses/addresses.reducer';
import { BasketState } from './basket/basket.reducer';
import { OrdersState } from './orders/orders.reducer';
import { UserState } from './user/user.reducer';

export interface CustomerState {
  user: UserState;
  addresses: AddressesState;
  orders: OrdersState;
  basket: BasketState;
  authorization: Authorization;
}

export const getCustomerState = createFeatureSelector<CustomerState>('_customer');
