import { EnvironmentProviders, NgModule, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

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
  OrdersEffects,
  RecurringOrdersEffects,
  OrganizationManagementEffects,
  RequisitionManagementEffects,
  SsoRegistrationEffects,
  DataRequestsEffects,
  UserNewsletterEffects,
];

export function provideCustomerAccountStore(): EnvironmentProviders {
  return makeEnvironmentProviders([importProvidersFrom(EffectsModule.forFeature(customerAccountEffects))]);
}

@NgModule({
  imports: [EffectsModule.forFeature(customerAccountEffects)],
})
export class CustomerAccountStoreModule {}
