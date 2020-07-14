import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { TactonConfigureProductComponent } from './shared/product/tacton-configure-product/tacton-configure-product.component';

@NgModule({
  imports: [SharedModule],
  declarations: [TactonConfigureProductComponent],
  exports: [SharedModule],
})
export class TactonModule {}
