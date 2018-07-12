import { Routes } from '@angular/router';
import { FeatureToggleGuard } from '../../../shared/feature-toggle/guards/feature-toggle.guard';
import { QuoteListPageContainerComponent } from './quote-list-page.container';

export const quoteListPageRoutes: Routes = [
  {
    path: '',
    component: QuoteListPageContainerComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'quoting' },
  },
];
