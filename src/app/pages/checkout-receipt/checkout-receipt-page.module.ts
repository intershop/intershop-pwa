import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutReceiptPageContainerComponent } from './checkout-receipt-page.container';
import { CheckoutReceiptComponent } from './components/checkout-receipt/checkout-receipt.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutReceiptComponent, CheckoutReceiptPageContainerComponent],
})
export class CheckoutReceiptPageModule {
  static component = CheckoutReceiptPageContainerComponent;
}
