import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

import { FormlyModule as IshFormlyModule } from 'ish-shared/formly/formly.module';

import { cookiesPageGuard } from './cookies-page.guard';

export const cookiesPageRoutes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [cookiesPageGuard],
    providers: [importProvidersFrom(IshFormlyModule)],
    data: {
      meta: {
        title: 'cookie.preferences.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
];
