import { Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';

import { QuoteEditPageContainerComponent } from './quote-edit-page.container';

export const quoteEditPageRoutes: Routes = [
  {
    path: ':quoteId',
    component: QuoteEditPageContainerComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'quoting' },
  },
];
