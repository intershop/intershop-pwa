import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

import { authGuard } from 'ish-core/guards/auth.guard';
import { featureToggleGuard } from 'ish-core/feature-toggle.module';

import { productAddToQuoteRequestGuard } from '../guards/product-add-to-quote-request.guard';
import { QuotingStoreModule } from '../store/quoting-store.module';

export const addToQuoteRoutes: Routes = [
  {
    path: '',
    canActivate: [featureToggleGuard, authGuard, productAddToQuoteRequestGuard],
    loadComponent: () =>
      import('../shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component').then(
        c => c.ProductAddToQuoteDialogComponent
      ),
    providers: [importProvidersFrom(QuotingStoreModule)],
    data: {
      feature: 'quoting',
      queryParams: {
        messageKey: 'quotes',
      },
    },
  },
];
