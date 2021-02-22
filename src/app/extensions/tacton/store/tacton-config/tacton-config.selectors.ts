import { createSelector } from '@ngrx/store';
import { UUID } from 'angular2-uuid';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';
import { getSelectedProduct } from 'ish-core/store/shopping/products';

import { getTactonState } from '../tacton-store';

export const getTactonConfig = createSelector(getTactonState, state => state?.tactonConfig);

export const getSelfServiceApiConfiguration = createSelector(getTactonConfig, config => config?.selfService);

export const getNewExternalId = createSelector(
  getLoggedInCustomer,
  getLoggedInUser,
  (customer: Customer, user: User) => customer && user && `${customer.companyName}(${user.login}) - ${UUID.UUID()}`
);

const productMappings = createSelector(getTactonConfig, state => state?.productMappings || {});

export const getTactonProductForSelectedProduct = createSelector(
  productMappings,
  getSelectedProduct,
  (mappings, product) => mappings[product?.sku]
);
