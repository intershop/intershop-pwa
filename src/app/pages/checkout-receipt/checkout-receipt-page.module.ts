import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutReceiptPageComponent } from './checkout-receipt-page.component';
import { CheckoutReceiptComponent } from './checkout-receipt/checkout-receipt.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutReceiptComponent, CheckoutReceiptPageComponent],
})
export class CheckoutReceiptPageModule {
  static component = CheckoutReceiptPageComponent;
}
