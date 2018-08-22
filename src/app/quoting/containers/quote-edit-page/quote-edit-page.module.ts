import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccountSharedModule } from '../../../account/account-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { QuotingSharedModule } from '../../quoting-shared.module';

import { QuoteEditPageContainerComponent } from './quote-edit-page.container';
import { quoteEditPageRoutes } from './quote-edit-page.routes';

@NgModule({
  declarations: [QuoteEditPageContainerComponent],
  imports: [AccountSharedModule, QuotingSharedModule, RouterModule.forChild(quoteEditPageRoutes), SharedModule],
})
export class QuoteEditPageModule {}
