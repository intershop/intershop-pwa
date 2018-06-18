import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountSharedModule } from '../../../account/account-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { B2bSharedModule } from '../../b2b-shared.module';
import { QuoteListComponent } from '../../components/quote-list/quote-list.component';
import { QuoteListPageContainerComponent } from './quote-list-page.container';
import { quoteListPageRoutes } from './quote-list-page.routes';

@NgModule({
  declarations: [QuoteListPageContainerComponent, QuoteListComponent],
  providers: [DatePipe],
  imports: [RouterModule.forChild(quoteListPageRoutes), SharedModule, AccountSharedModule, B2bSharedModule],
})
export class QuoteListPageModule {}
