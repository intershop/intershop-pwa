import { createSelector } from '@ngrx/store';

import { PriceType } from 'ish-core/models/price/price.model';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { getCustomerState } from 'ish-core/store/customer/customer-store';

const getUserState = createSelector(getCustomerState, state => state.user);

export const getLoggedInCustomer = createSelector(getUserState, state => state.customer);

export const isBusinessCustomer = createSelector(
  getLoggedInCustomer,
  customer => !!customer && customer.isBusinessCustomer
);

export const getLoggedInUser = createSelector(getUserState, state => state.user);

export const getUserAuthorized = createSelector(getUserState, state => state.authorized);

export const getUserCostCenters = createSelector(getUserState, state => state.costCenters);

export const getUserPaymentMethods = createSelector(getUserState, state => state.paymentMethods);

export const getUserLoading = createSelector(getUserState, state => state.loading);

export const getUserError = createSelector(getUserState, state => state.error);

export const getPGID = createSelector(getUserState, state => state.pgid);

export const getPasswordReminderSuccess = createSelector(getUserState, state => state.passwordReminderSuccess);

export const getPasswordReminderError = createSelector(getUserState, state => state.passwordReminderError);

export const getCustomerApprovalEmail = createSelector(getUserState, state => state.customerApprovalEmail);

export const getPriceDisplayType = createSelector(
  getUserAuthorized,
  isBusinessCustomer,
  getServerConfigParameter<'PRIVATE' | 'SMB'>('pricing.defaultCustomerTypeForPriceDisplay'),
  getServerConfigParameter<PriceType>('pricing.privateCustomerPriceDisplayType'),
  getServerConfigParameter<PriceType>('pricing.smbCustomerPriceDisplayType'),
  (loggedIn, businessCustomer, defaultCustomer, b2c, b2b): PriceType => {
    const isB2B = (!loggedIn && defaultCustomer === 'SMB') || businessCustomer;
    return isB2B ? b2b || 'net' : b2c || 'gross';
  }
);

export const getNewsletterSubscriptionStatus = createSelector(getUserState, state => state.subscribedToNewsletter);
