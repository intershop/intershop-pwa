import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

import { provideCaptchaFeature } from '../../../captcha/captcha-feature.providers';
import { provideContactUsStore } from '../../store/contact-us-store.module';

export const contactPageRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./contact-page.component').then(m => m.ContactPageComponent),
    canActivate: [featureToggleGuard],
    providers: [provideContactUsStore(), ...provideCaptchaFeature()],
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
