import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { identityProviderPasswordGuard } from 'ish-core/guards/identity-provider-password.guard';

import { RequestReminderFormComponent } from './request-reminder-form/request-reminder-form.component';
import { RequestReminderComponent } from './request-reminder/request-reminder.component';
import { UpdatePasswordFormComponent } from './update-password-form/update-password-form.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const forgotPasswordPageRoutes: Routes = [
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

@NgModule({
  imports: [
    RequestReminderComponent,
    RouterModule.forChild(forgotPasswordPageRoutes),
    RequestReminderFormComponent,
    UpdatePasswordComponent,
    UpdatePasswordFormComponent,
  ],
})
export class ForgotPasswordPageModule {}
