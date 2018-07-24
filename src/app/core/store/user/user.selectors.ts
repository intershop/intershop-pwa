import { createSelector } from '@ngrx/store';

import { OrderView } from '../../../models/order/order.model';
import { getProductEntities } from '../../../shopping/store/products';
import { CoreState } from '../core.state';
import { getAuthorized, getAuthToken, getCustomer, getError, getUser } from './user.reducer';

const getUserState = (state: CoreState) => state.user;

export const getLoggedInCustomer = createSelector(getUserState, getCustomer);
export const getLoggedInUser = createSelector(getUserState, getUser);
export const getUserAuthorized = createSelector(getUserState, getAuthorized);
export const getUserError = createSelector(getUserState, getError);
export const getAPIToken = createSelector(getUserState, getAuthToken);

export const getUserRecentOrder = createSelector(
  getUserState,
  getProductEntities,
  (user, products): OrderView =>
    !user.recentOrder
      ? null
      : {
          ...user.recentOrder,
          lineItems: user.recentOrder.lineItems.map(li => ({
            ...li,
            product: products[li.productSKU],
          })),
        }
);
