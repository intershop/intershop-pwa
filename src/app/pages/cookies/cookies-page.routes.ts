import { Routes } from '@angular/router';

import { cookiesPageGuard } from './cookies-page.guard';

export const cookiesPageRoutes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [cookiesPageGuard],
    data: {
      meta: {
        title: 'cookie.preferences.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
];
