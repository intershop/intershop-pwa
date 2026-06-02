import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle';
import { authGuard } from 'ish-core/guards/auth.guard';

export const orderTemplatesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./account-order-template/account-order-template-page.component').then(
        m => m.AccountOrderTemplatePageComponent
      ),
    canActivate: [featureToggleGuard, authGuard],
    data: { feature: 'orderTemplates', breadcrumbData: [{ key: 'account.ordertemplates.link' }] },
  },
  {
    path: ':orderTemplateName',
    loadComponent: () =>
      import('./account-order-template-detail/account-order-template-detail-page.component').then(
        m => m.AccountOrderTemplateDetailPageComponent
      ),
    canActivate: [featureToggleGuard, authGuard],
    data: { feature: 'orderTemplates' },
  },
];
