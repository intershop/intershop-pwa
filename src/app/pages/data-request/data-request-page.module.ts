import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

import { CustomerAccountStoreModule } from 'ish-core/store/customer/customer-account-store.module';
import { FormlyModule as IshFormlyModule } from 'ish-shared/formly/formly.module';

export const dataRequestPageRoutes: Routes = [
  {
    path: '**',
    loadComponent: () => import('./data-request-page.component').then(m => m.DataRequestPageComponent),
    providers: [importProvidersFrom(CustomerAccountStoreModule, IshFormlyModule)],
  },
];
