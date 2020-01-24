import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingModule } from '../../quoting.module';

import { QuoteEditPageComponent } from './quote-edit-page.component';

const quoteEditPageRoutes: Routes = [{ path: ':quoteId', component: QuoteEditPageComponent }];

@NgModule({
  declarations: [QuoteEditPageComponent],
  imports: [QuotingModule, RouterModule.forChild(quoteEditPageRoutes)],
})
export class QuoteEditPageModule {}
