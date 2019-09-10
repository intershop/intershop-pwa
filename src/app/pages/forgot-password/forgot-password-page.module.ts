import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { ForgotPasswordPageComponent } from './components/forgot-password-page/forgot-password-page.component';
import { ForgotPasswordPageContainerComponent } from './forgot-password-page.container';

const forgotPasswordPageRoutes: Routes = [{ path: '', component: ForgotPasswordPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(forgotPasswordPageRoutes), SharedModule],
  declarations: [ForgotPasswordFormComponent, ForgotPasswordPageComponent, ForgotPasswordPageContainerComponent],
})
export class ForgotPasswordPageModule {}
