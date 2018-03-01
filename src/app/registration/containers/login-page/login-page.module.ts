import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { LoginPageComponent } from './login-page.container';
import { loginPageRoutes } from './login-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(loginPageRoutes),
    SharedModule
  ],
  declarations: [
    LoginPageComponent
  ]
})

export class LoginPageModule { }
