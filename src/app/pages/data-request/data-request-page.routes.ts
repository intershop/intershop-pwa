import { Routes } from '@angular/router';

import { provideCustomerAccountStore } from 'ish-core/store/customer/customer-account-store.providers';

export const dataRequestPageRoutes: Routes = [
  {
    path: '**',
    loadComponent: () => import('./data-request-page.component').then(m => m.DataRequestPageComponent),
    providers: [provideCustomerAccountStore()],
  },
];
