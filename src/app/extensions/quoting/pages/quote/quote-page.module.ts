import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingModule } from '../../quoting.module';

import { QuotePageComponent } from './quote-page.component';

const quotePageRoutes: Routes = [{ path: '', component: QuotePageComponent }];

@NgModule({
  imports: [QuotingModule, RouterModule.forChild(quotePageRoutes)],
  declarations: [QuotePageComponent],
})
export class QuotePageModule {}
