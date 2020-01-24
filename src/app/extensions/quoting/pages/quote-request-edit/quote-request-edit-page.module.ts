import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingModule } from '../../quoting.module';

import { QuoteRequestEditPageComponent } from './quote-request-edit-page.component';

const quoteRequestEditPageRoutes: Routes = [{ path: ':quoteRequestId', component: QuoteRequestEditPageComponent }];

@NgModule({
  declarations: [QuoteRequestEditPageComponent],
  imports: [QuotingModule, RouterModule.forChild(quoteRequestEditPageRoutes)],
})
export class QuoteRequestEditPageModule {}
