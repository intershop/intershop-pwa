import { NgModule } from '@angular/core';
import { OrganizationManagementExportsModule } from 'organization-management';
import { RequisitionManagementExportsModule } from 'requisition-management';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOverviewPageComponent } from './account-overview-page.component';
import { AccountOverviewComponent } from './account-overview/account-overview.component';

@NgModule({
  imports: [OrganizationManagementExportsModule, RequisitionManagementExportsModule, SharedModule],
  declarations: [AccountOverviewComponent, AccountOverviewPageComponent],
})
export class AccountOverviewPageModule {
  static component = AccountOverviewPageComponent;
}
