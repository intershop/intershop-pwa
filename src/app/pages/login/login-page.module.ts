import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { LoginPageComponent } from './login-page.component';

const loginPageRoutes: Routes = [{ path: '', component: LoginPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(loginPageRoutes), SharedModule],
  declarations: [LoginPageComponent],
})
export class LoginPageModule {}
