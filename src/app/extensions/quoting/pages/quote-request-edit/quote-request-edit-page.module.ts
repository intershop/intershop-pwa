import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingModule } from '../../quoting.module';

import { QuoteRequestEditPageContainerComponent } from './quote-request-edit-page.container';

const quoteRequestEditPageRoutes: Routes = [
  { path: ':quoteRequestId', component: QuoteRequestEditPageContainerComponent },
];

@NgModule({
  declarations: [QuoteRequestEditPageContainerComponent],
  imports: [QuotingModule, RouterModule.forChild(quoteRequestEditPageRoutes)],
})
export class QuoteRequestEditPageModule {}
