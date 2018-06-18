import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { QuoteStateComponent } from './components/quote-state/quote-state.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [QuoteStateComponent],
  exports: [QuoteStateComponent],
})
export class B2bSharedModule {}
