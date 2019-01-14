import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingModule } from '../../quoting.module';

import { QuoteEditPageContainerComponent } from './quote-edit-page.container';

const quoteEditPageRoutes: Routes = [{ path: ':quoteId', component: QuoteEditPageContainerComponent }];

@NgModule({
  declarations: [QuoteEditPageContainerComponent],
  imports: [QuotingModule, RouterModule.forChild(quoteEditPageRoutes)],
})
export class QuoteEditPageModule {}
