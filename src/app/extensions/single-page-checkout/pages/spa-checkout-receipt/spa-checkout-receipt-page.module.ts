import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { SpaCheckoutReceiptPageComponent } from './spa-checkout-receipt-page.component';
import { SpaCheckoutReceiptComponent } from './spa-checkout-receipt/spa-checkout-receipt.component';

@NgModule({
  imports: [SharedModule],
  declarations: [SpaCheckoutReceiptPageComponent, SpaCheckoutReceiptComponent],
  exports: [SpaCheckoutReceiptPageComponent],
})
export class SpaCheckoutReceiptPageModule {}
