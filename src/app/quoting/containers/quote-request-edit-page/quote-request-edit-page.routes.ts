import { Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';

import { QuoteRequestEditPageContainerComponent } from './quote-request-edit-page.container';

export const quoteRequestEditPageRoutes: Routes = [
  {
    path: ':quoteRequestId',
    component: QuoteRequestEditPageContainerComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'quoting' },
  },
];
