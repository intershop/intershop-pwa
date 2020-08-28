import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Quoting2Module } from '../../quoting2.module';

import { QuoteListPageComponent } from './quote-list-page.component';
import { QuoteListComponent } from './quote-list/quote-list.component';

const quoteListPageRoutes: Routes = [{ path: '', component: QuoteListPageComponent }];

@NgModule({
  declarations: [QuoteListComponent, QuoteListPageComponent],
  imports: [Quoting2Module, RouterModule.forChild(quoteListPageRoutes)],
})
export class QuoteListPageModule {}
