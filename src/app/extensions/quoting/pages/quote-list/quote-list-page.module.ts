import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingModule } from '../../quoting.module';

import { QuoteListComponent } from './components/quote-list/quote-list.component';
import { QuoteListPageContainerComponent } from './quote-list-page.container';

const quoteListPageRoutes: Routes = [{ path: '', component: QuoteListPageContainerComponent }];

@NgModule({
  declarations: [QuoteListComponent, QuoteListPageContainerComponent],
  imports: [QuotingModule, RouterModule.forChild(quoteListPageRoutes)],
})
export class QuoteListPageModule {}
