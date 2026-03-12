import { Routes } from '@angular/router';
import { provideFormlyConfig } from '@ngx-formly/core';

import { providePunchoutStore } from '../store/punchout-store.providers';

import { ociConfigurationFormlyConfig } from './account-punchout-configuration/account-punchout-configuration-page.component';
import { cxmlConfigurationFormlyConfig } from './account-punchout-cxml-configuration/account-punchout-cxml-configuration-page.component';

export const punchoutAccountRoutes: Routes = [
  {
    path: '',
    providers: [providePunchoutStore()],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./account-punchout/account-punchout-page.component').then(m => m.AccountPunchoutPageComponent),
      },
      {
        path: 'configuration',
        data: {
          breadcrumbData: [
            { key: 'account.punchout.link', link: '/account/punchout' },
            { key: 'account.punchout.configuration.link' },
          ],
        },
        providers: [provideFormlyConfig(ociConfigurationFormlyConfig)],
        loadComponent: () =>
          import('./account-punchout-configuration/account-punchout-configuration-page.component').then(
            m => m.AccountPunchoutConfigurationPageComponent
          ),
      },
      {
        path: 'cxmlConfiguration/:PunchoutLogin',
        data: {
          breadcrumbData: [
            { key: 'account.punchout.link', link: '/account/punchout' },
            { key: 'account.punchout.cxml.configuration.link' },
          ],
        },
        providers: [provideFormlyConfig(cxmlConfigurationFormlyConfig)],
        loadComponent: () =>
          import('./account-punchout-cxml-configuration/account-punchout-cxml-configuration-page.component').then(
            m => m.AccountPunchoutCxmlConfigurationPageComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./account-punchout-create/account-punchout-create-page.component').then(
            m => m.AccountPunchoutCreatePageComponent
          ),
      },
      {
        path: ':PunchoutLogin',
        data: {
          breadcrumbData: [
            { key: 'account.punchout.link', link: '/account/punchout' },
            { key: 'account.punchout.user.details.link' },
          ],
        },
        loadComponent: () =>
          import('./account-punchout-details/account-punchout-details-page.component').then(
            m => m.AccountPunchoutDetailsPageComponent
          ),
      },
    ],
  },
];

