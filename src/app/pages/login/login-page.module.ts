import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginGuard } from 'ish-core/guards/login.guard';
import { SharedModule } from 'ish-shared/shared.module';

import { LoginPageComponent } from './login-page.component';

const loginPageRoutes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [LoginGuard],
    data: {
      meta: {
        title: 'account.login.link',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(loginPageRoutes), SharedModule],
  declarations: [LoginPageComponent],
})
export class LoginPageModule {}
