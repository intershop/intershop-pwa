import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'quote-list',
    loadChildren: './quote-list/quote-list-page.module#QuoteListPageModule',
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'quoting' },
  },
  {
    path: 'quote',
    loadChildren: './quote-edit/quote-edit-page.module#QuoteEditPageModule',
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'quoting' },
  },
  {
    path: 'quote-request',
    loadChildren: './quote-request-edit/quote-request-edit-page.module#QuoteRequestEditPageModule',
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'quoting' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotingRoutingModule {}
