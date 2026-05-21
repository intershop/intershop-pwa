import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { loginGuard } from 'ish-core/guards/login.guard';
import { SharedModule } from 'ish-shared/shared.module';

import { LoginPageComponent } from './login-page.component';

const loginPageRoutes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [loginGuard],
    data: {
      meta: {
        title: 'account.login.link',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  declarations: [LoginPageComponent],
  imports: [RouterModule.forChild(loginPageRoutes), SharedModule],
})
export class LoginPageModule {}
