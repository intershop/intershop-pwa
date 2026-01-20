import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

import { identityProviderPasswordGuard } from 'ish-core/guards/identity-provider-password.guard';
import { FormlyModule as IshFormlyModule } from 'ish-shared/formly/formly.module';

export const forgotPasswordPageRoutes: Routes = [
  {
    path: '',
    providers: [importProvidersFrom(IshFormlyModule)],
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
