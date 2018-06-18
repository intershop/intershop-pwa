import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountSharedModule } from '../../../account/account-shared.module';
import { SharedLineItemListModule } from '../../../shared/shared-line-item-list.module';
import { SharedModule } from '../../../shared/shared.module';
import { B2bSharedModule } from '../../b2b-shared.module';
import { QuoteEditComponent } from '../../components/quote-edit/quote-edit.component';
import { QuoteEditPageContainerComponent } from './quote-edit-page.container';
import { quoteEditPageRoutes } from './quote-edit-page.routes';

@NgModule({
  declarations: [QuoteEditPageContainerComponent, QuoteEditComponent],
  providers: [DatePipe],
  imports: [
    RouterModule.forChild(quoteEditPageRoutes),
    SharedModule,
    AccountSharedModule,
    B2bSharedModule,
    SharedLineItemListModule,
  ],
})
export class QuoteEditPageModule {}
