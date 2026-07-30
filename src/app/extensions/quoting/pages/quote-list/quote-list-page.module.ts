import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingModule } from '../../quoting.module';

import { QuoteListPageComponent } from './quote-list-page.component';
import { QuoteListComponent } from './quote-list/quote-list.component';

const quoteListPageRoutes: Routes = [
  { path: '', component: QuoteListPageComponent },
  {
    path: ':quoteId',
    loadChildren: () => import('../quote/quote-page.module').then(m => m.QuotePageModule),
  },
];

@NgModule({
  imports: [QuotingModule, RouterModule.forChild(quoteListPageRoutes)],
  declarations: [QuoteListComponent, QuoteListPageComponent],
})
export class QuoteListPageModule {}
