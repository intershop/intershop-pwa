import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

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
  },
];

@NgModule({
  imports: [RouterModule.forChild(forgotPasswordPageRoutes), SharedModule],
  declarations: [
    RequestReminderComponent,
    RequestReminderFormComponent,
    UpdatePasswordComponent,
    UpdatePasswordFormComponent,
  ],
})
export class ForgotPasswordPageModule {}
