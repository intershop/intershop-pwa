import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductAddToCompareComponent } from './shared/product-add-to-compare/product-add-to-compare.component';
import { ProductCompareStatusComponent } from './shared/product-compare-status/product-compare-status.component';
import { ProductSendToCompareComponent } from './shared/product-send-to-compare/product-send-to-compare.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ProductAddToCompareComponent, ProductCompareStatusComponent, ProductSendToCompareComponent],
  exports: [SharedModule],
})
export class CompareModule {}
