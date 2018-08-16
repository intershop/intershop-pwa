import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccountSharedModule } from '../../../account/account-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { QuotingSharedModule } from '../../quoting-shared.module';

import { QuoteRequestEditPageContainerComponent } from './quote-request-edit-page.container';
import { quoteRequestEditPageRoutes } from './quote-request-edit-page.routes';

@NgModule({
  declarations: [QuoteRequestEditPageContainerComponent],
  imports: [RouterModule.forChild(quoteRequestEditPageRoutes), SharedModule, AccountSharedModule, QuotingSharedModule],
})
export class QuoteRequestEditPageModule {}
