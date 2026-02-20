import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';
import { FormlyModule as IshFormlyModule } from 'ish-shared/formly/formly.module';

import { CaptchaExportsModule } from '../../../captcha/exports/captcha-exports.module';
import { ContactUsStoreModule } from '../../store/contact-us-store.module';

export const contactPageRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./contact-page.component').then(m => m.ContactPageComponent),
    canActivate: [featureToggleGuard],
    providers: [importProvidersFrom(ContactUsStoreModule, CaptchaExportsModule, IshFormlyModule)],
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
