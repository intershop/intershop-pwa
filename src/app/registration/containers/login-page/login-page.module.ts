import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

import { LoginPageContainerComponent } from './login-page.container';
import { loginPageRoutes } from './login-page.routes';

@NgModule({
  imports: [FormsSharedModule, RouterModule.forChild(loginPageRoutes), SharedModule],
  declarations: [LoginFormComponent, LoginPageContainerComponent],
})
export class LoginPageModule {}
