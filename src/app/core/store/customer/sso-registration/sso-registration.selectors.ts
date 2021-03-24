import { createSelector } from '@ngrx/store';

import { CustomerState, getCustomerState } from 'ish-core/store/customer/customer-store';

const getSsoRegistrationState = createSelector(getCustomerState, (state: CustomerState) => state.ssoRegistration);

export const getSsoRegistrationInfo = createSelector(getSsoRegistrationState, state => ({
  address: state.address,
  companyInfo: state.companyInfo,
}));
