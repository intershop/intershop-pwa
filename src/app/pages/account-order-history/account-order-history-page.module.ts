import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { OrganizationManagementExportsModule } from 'organization-management';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOrderFiltersComponent } from './account-order-filters/account-order-filters.component';
import { AccountOrderHistoryPageComponent } from './account-order-history-page.component';
import { AccountOrderSelectBuyerFieldComponent } from './formly/account-order-select-buyer-field/account-order-select-buyer-field.component';

const routes: Routes = [
  { path: '', component: AccountOrderHistoryPageComponent },
  {
    path: ':orderId',
    data: {
      breadcrumbData: [{ key: 'account.order_history.link', link: '/account/orders' }],
    },
    loadChildren: () => import('../account-order/account-order-page.module').then(m => m.AccountOrderPageModule),
  },
];

const orderHistoryFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-account-order-select-buyer-field',
      component: AccountOrderSelectBuyerFieldComponent,
      wrappers: ['form-field-horizontal', 'validation'],
    },
  ],
};

@NgModule({
  imports: [
    OrganizationManagementExportsModule,
    FormlyModule.forChild(orderHistoryFormlyConfig),
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [AccountOrderFiltersComponent, AccountOrderHistoryPageComponent, AccountOrderSelectBuyerFieldComponent],
})
export class AccountOrderHistoryPageModule {}
