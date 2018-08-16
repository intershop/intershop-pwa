import { Routes } from '@angular/router';

import { FeatureToggleGuard } from '../../../shared/feature-toggle/guards/feature-toggle.guard';

import { QuoteEditPageContainerComponent } from './quote-edit-page.container';

export const quoteEditPageRoutes: Routes = [
  {
    path: ':quoteId',
    component: QuoteEditPageContainerComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'quoting' },
  },
];
