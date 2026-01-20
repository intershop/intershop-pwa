import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingStoreModule } from '../store/quoting-store.module';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class QuotingRoutingModule {}
