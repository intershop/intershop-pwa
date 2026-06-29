import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';

import { AddressesEffects } from './addresses/addresses.effects';
import { DataRequestsEffects } from './data-requests/data-requests.effects';
import { OrdersEffects } from './orders/orders.effects';
import { OrganizationManagementEffects } from './organization-management/organization-management.effects';
import { RecurringOrdersEffects } from './recurring-orders/recurring-orders.effects';
import { RequisitionManagementEffects } from './requisition-management/requisition-management.effects';
import { SsoRegistrationEffects } from './sso-registration/sso-registration.effects';
import { UserNewsletterEffects } from './user/user-newsletter.effects';

const customerAccountEffects = [
  AddressesEffects,
  DataRequestsEffects,
  OrdersEffects,
  OrganizationManagementEffects,
  RecurringOrdersEffects,
  RequisitionManagementEffects,
  SsoRegistrationEffects,
  UserNewsletterEffects,
];

export function provideCustomerAccountStore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideEffects(customerAccountEffects)]);
}

export class CustomerAccountStoreProviders {}
