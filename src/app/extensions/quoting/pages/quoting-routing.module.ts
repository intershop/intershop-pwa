import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'addProductToQuoteRequest',
    canActivate: [FeatureToggleGuard, AuthGuard],
    loadChildren: () =>
      import('./quoting-product-add-to-quote-request-routing.module').then(
        m => m.QuotingProductAddToQuoteRequestRoutingModule
      ),
    data: {
      feature: 'quoting',
      queryParams: {
        messageKey: 'quotes',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotingRoutingModule {}
