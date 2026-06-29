import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle';
import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

export const contactPageRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./contact-page.component').then(m => m.ContactPageComponent),
    canActivate: [
      featureToggleGuard,
      () =>
        inject(ModuleLoaderService)
          .ensureLoaded('contactUs')
          .then(() => true),
    ],
    data: {
      feature: 'contactUs',
      meta: {
        title: 'helpdesk.contact_us.heading',
        robots: 'index, nofollow',
      },
      breadcrumbData: [{ key: 'helpdesk.contact_us.link' }],
    },
  },
];
