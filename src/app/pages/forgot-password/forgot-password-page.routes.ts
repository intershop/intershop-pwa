import { Routes } from '@angular/router';

import { identityProviderPasswordGuard } from 'ish-core/guards/identity-provider-password.guard';

import { RequestReminderComponent } from './request-reminder/request-reminder.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

export const forgotPasswordPageRoutes: Routes = [
  {
    path: '',
    component: RequestReminderComponent,
  },
  {
    path: 'updatePassword',
    component: UpdatePasswordComponent,
    canActivate: [identityProviderPasswordGuard],
  },
];
