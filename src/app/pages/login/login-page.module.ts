import { Routes } from '@angular/router';

import { loginGuard } from 'ish-core/guards/login.guard';

import { LoginPageComponent } from './login-page.component';

export const loginPageRoutes: Routes = [
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
