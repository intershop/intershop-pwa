import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { OrganizationManagementStoreModule } from 'projects/organization-management/src/app/store/organization-management-store.module';

import { AccountOrderHistoryPageComponent } from './account-order-history-page.component';
import { AccountOrderSelectBuyerFieldComponent } from './formly/account-order-select-buyer-field/account-order-select-buyer-field.component';

export const accountOrderHistoryRoutes: Routes = [
  {
    path: '',
    component: AccountOrderHistoryPageComponent,
    providers: [
      importProvidersFrom(
        FormlyModule.forChild({
          types: [
            {
              name: 'ish-account-order-select-buyer-field',
              component: AccountOrderSelectBuyerFieldComponent,
              wrappers: ['form-field-horizontal', 'validation'],
            },
          ],
        }),
        OrganizationManagementStoreModule
      ),
    ],
  },
  {
    path: ':orderId',
    data: {
      breadcrumbData: [{ key: 'account.order_history.link', link: '/account/orders' }],
    },
    loadComponent: () => import('../account-order/account-order-page.component').then(m => m.AccountOrderPageComponent),
  },
];
