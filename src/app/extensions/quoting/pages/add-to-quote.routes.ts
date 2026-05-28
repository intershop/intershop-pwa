import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle';
import { authGuard } from 'ish-core/guards/auth.guard';

import { productAddToQuoteRequestGuard } from '../guards/product-add-to-quote-request.guard';
import { provideQuotingStore } from '../store/quoting-store.providers';

export const addToQuoteRoutes: Routes = [
  {
    path: '',
    canActivate: [featureToggleGuard, authGuard],
    providers: [provideQuotingStore()],
    children: [
      {
        path: '',
        canActivate: [productAddToQuoteRequestGuard],
        children: [],
      },
    ],
    data: {
      feature: 'quoting',
      queryParams: {
        messageKey: 'quotes',
      },
    },
  },
];
