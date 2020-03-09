import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./quote-list/quote-list-page.module').then(m => m.QuoteListPageModule),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'quoting' },
  },
  {
    path: ':quoteId',
    loadChildren: () => import('./quote-edit/quote-edit-page.module').then(m => m.QuoteEditPageModule),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: {
      feature: 'quoting',
      breadcrumbData: [{ key: 'quote.quotes.link', link: '/account/quotes' }, { key: 'quote.quote_details.link' }],
    },
  },
  {
    path: 'request/:quoteRequestId',
    loadChildren: () =>
      import('./quote-request-edit/quote-request-edit-page.module').then(m => m.QuoteRequestEditPageModule),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: {
      feature: 'quoting',
      breadcrumbData: [
        { key: 'quote.quotes.link', link: '/account/quotes' },
        { key: 'quote.edit.unsubmitted.quote_request_details.text' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotingRoutingModule {}
