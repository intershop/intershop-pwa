import { Routes } from '@angular/router';

import { identityProviderPasswordGuard } from 'ish-core/guards/identity-provider-password.guard';

export const forgotPasswordPageRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./request-reminder/request-reminder.component').then(m => m.RequestReminderComponent),
      },
      {
        path: 'updatePassword',
        canActivate: [identityProviderPasswordGuard],
        loadComponent: () => import('./update-password/update-password.component').then(m => m.UpdatePasswordComponent),
      },
    ],
  },
];
