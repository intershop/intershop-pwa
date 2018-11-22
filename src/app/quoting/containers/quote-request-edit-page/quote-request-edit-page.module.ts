import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { QuotingSharedModule } from '../../quoting-shared.module';

import { QuoteRequestEditPageContainerComponent } from './quote-request-edit-page.container';
import { quoteRequestEditPageRoutes } from './quote-request-edit-page.routes';

@NgModule({
  declarations: [QuoteRequestEditPageContainerComponent],
  imports: [QuotingSharedModule, RouterModule.forChild(quoteRequestEditPageRoutes), SharedModule],
})
export class QuoteRequestEditPageModule {}
