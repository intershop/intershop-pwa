import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccountSharedModule } from '../../../account/account-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { QuoteListComponent } from '../../components/quote-list/quote-list.component';
import { QuotingSharedModule } from '../../quoting-shared.module';

import { QuoteListPageContainerComponent } from './quote-list-page.container';
import { quoteListPageRoutes } from './quote-list-page.routes';

@NgModule({
  declarations: [QuoteListComponent, QuoteListPageContainerComponent],
  imports: [AccountSharedModule, QuotingSharedModule, RouterModule.forChild(quoteListPageRoutes), SharedModule],
})
export class QuoteListPageModule {}
