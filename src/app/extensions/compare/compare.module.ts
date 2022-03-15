import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductCompareStatusComponent } from './shared/product-compare-status/product-compare-status.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ProductCompareStatusComponent],
  exports: [SharedModule],
})
export class CompareModule {}
