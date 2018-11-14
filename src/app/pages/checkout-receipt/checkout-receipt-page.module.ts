import { NgModule } from '@angular/core';

import { SharedAddressModule } from '../../shared/shared-address.module';
import { SharedBasketModule } from '../../shared/shared-basket.module';
import { SharedModule } from '../../shared/shared.module';

import { CheckoutReceiptPageContainerComponent } from './checkout-receipt-page.container';
import { CheckoutReceiptComponent } from './components/checkout-receipt/checkout-receipt.component';

@NgModule({
  imports: [SharedAddressModule, SharedBasketModule, SharedModule],
  declarations: [CheckoutReceiptComponent, CheckoutReceiptPageContainerComponent],
})
export class CheckoutReceiptPageModule {
  static component = CheckoutReceiptPageContainerComponent;
}
