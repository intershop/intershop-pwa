import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Quoting2Module } from '../../quoting2.module';

import { QuotePageComponent } from './quote-page.component';

const quotePageRoutes: Routes = [{ path: '', component: QuotePageComponent }];

@NgModule({
  imports: [Quoting2Module, RouterModule.forChild(quotePageRoutes)],
  declarations: [QuotePageComponent],
})
export class QuotePageModule {}
