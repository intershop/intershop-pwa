import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

import { QuotingStoreModule } from '../store/quoting-store.module';

export const quotingRoutes: Routes = [
  {
    path: '',
    providers: [importProvidersFrom(QuotingStoreModule)],
    children: [
      {
        path: '',
        loadComponent: () => import('./quote-list/quote-list-page.component').then(c => c.QuoteListPageComponent),
      },
      {
        path: ':quoteId',
        loadComponent: () => import('./quote/quote-page.component').then(c => c.QuotePageComponent),
      },
    ],
  },
];
