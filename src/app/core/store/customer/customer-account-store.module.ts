import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { AddressesEffects } from './addresses/addresses.effects';
import { DataRequestsEffects } from './data-requests/data-requests.effects';
import { OrdersEffects } from './orders/orders.effects';
import { OrganizationManagementEffects } from './organization-management/organization-management.effects';
import { RecurringOrdersEffects } from './recurring-orders/recurring-orders.effects';
import { RequisitionManagementEffects } from './requisition-management/requisition-management.effects';
import { SsoRegistrationEffects } from './sso-registration/sso-registration.effects';
import { UserNewsletterEffects } from './user/user-newsletter.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      AddressesEffects,
      OrdersEffects,
      RecurringOrdersEffects,
      OrganizationManagementEffects,
      RequisitionManagementEffects,
      SsoRegistrationEffects,
      DataRequestsEffects,
      UserNewsletterEffects,
    ]),
  ],
})
export class CustomerAccountStoreModule {}
