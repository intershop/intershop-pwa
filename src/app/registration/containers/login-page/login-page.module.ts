import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { LoginPageComponent } from './login-page.container';
import { loginPageRoutes } from './login-page.routes';
import { SimpleRegistrationComponent } from './simple-registration/simple-registration.component';

@NgModule({
  imports: [
    RouterModule.forChild(loginPageRoutes),
    SharedModule
  ],
  declarations: [
    LoginPageComponent,
    SimpleRegistrationComponent
  ]
})

export class LoginPageModule { }
