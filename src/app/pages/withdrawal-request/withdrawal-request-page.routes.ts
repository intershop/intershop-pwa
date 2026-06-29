import { Routes } from '@angular/router';

import { provideIshFormly } from 'ish-shared/formly/formly';

export const withdrawalRequestPageRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./withdrawal-request-page.component').then(m => m.WithdrawalRequestPageComponent),
    providers: [...provideIshFormly()],
  },
];
