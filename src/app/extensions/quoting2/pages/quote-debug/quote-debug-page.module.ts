import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Quoting2Module } from '../../quoting2.module';

import { QuoteDebugPageComponent } from './quote-debug-page.component';

const quoteDebugPageRoutes: Routes = [{ path: '', component: QuoteDebugPageComponent }];

@NgModule({
  imports: [Quoting2Module, RouterModule.forChild(quoteDebugPageRoutes)],
  declarations: [QuoteDebugPageComponent],
})
export class QuoteDebugPageModule {}
