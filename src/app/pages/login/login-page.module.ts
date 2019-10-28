import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { LoginPageContainerComponent } from './login-page.container';

const loginPageRoutes: Routes = [{ path: '', component: LoginPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(loginPageRoutes), SharedModule],
  declarations: [LoginPageContainerComponent],
})
export class LoginPageModule {}
