import { Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';

import { QuoteListPageContainerComponent } from './quote-list-page.container';

export const quoteListPageRoutes: Routes = [
  {
    path: '',
    component: QuoteListPageContainerComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'quoting' },
  },
];
