import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingModule } from '../../quoting.module';

import { QuoteListPageComponent } from './quote-list-page.component';
import { QuoteListComponent } from './quote-list/quote-list.component';

const quoteListPageRoutes: Routes = [
  { path: '', component: QuoteListPageComponent, data: { breadcrumbData: [{ key: 'quote.quotes.link' }] } },
  {
    path: ':quoteId',
    loadChildren: () => import('../quote/quote-page.module').then(m => m.QuotePageModule),
  },
];

@NgModule({
  declarations: [QuoteListComponent, QuoteListPageComponent],
  imports: [QuotingModule, RouterModule.forChild(quoteListPageRoutes)],
})
export class QuoteListPageModule {}
