import { Routes } from '@angular/router';

import { provideQuotingStore } from '../store/quoting-store.providers';

export const quotingRoutes: Routes = [
  {
    path: '',
    providers: [provideQuotingStore()],
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
