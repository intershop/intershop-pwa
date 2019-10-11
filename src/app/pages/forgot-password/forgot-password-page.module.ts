import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgotPasswordPageContainerComponent } from './forgot-password-page.container';

const forgotPasswordPageRoutes: Routes = [{ path: '', component: ForgotPasswordPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(forgotPasswordPageRoutes), SharedModule],
  declarations: [ForgotPasswordComponent, ForgotPasswordFormComponent, ForgotPasswordPageContainerComponent],
})
export class ForgotPasswordPageModule {}
