import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LoginPageComponent } from './login-page.container';
import { loginPageRoutes } from './login-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(loginPageRoutes),
    SharedModule
  ],
  declarations: [
    LoginPageComponent,
    LoginFormComponent
  ]
})

export class LoginPageModule { }
