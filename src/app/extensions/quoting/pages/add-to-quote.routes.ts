import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle';
import { authGuard } from 'ish-core/guards/auth.guard';

import { productAddToQuoteRequestGuard } from '../guards/product-add-to-quote-request.guard';
import { provideQuotingStore } from '../store/quoting-store.providers';

export const addToQuoteRoutes: Routes = [
  {
    path: '',
    canActivate: [featureToggleGuard, authGuard, productAddToQuoteRequestGuard],
    loadComponent: () =>
      import('../shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component').then(
        c => c.ProductAddToQuoteDialogComponent
      ),
    providers: [provideQuotingStore()],
    data: {
      feature: 'quoting',
      queryParams: {
        messageKey: 'quotes',
      },
    },
  },
];
