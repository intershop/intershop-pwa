import { NgModule } from '@angular/core';
import { RequisitionManagementExportsModule } from 'requisition-management';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutReceiptOrderComponent } from './checkout-receipt-order/checkout-receipt-order.component';
import { CheckoutReceiptPageComponent } from './checkout-receipt-page.component';
import { CheckoutReceiptComponent } from './checkout-receipt/checkout-receipt.component';

@NgModule({
  declarations: [CheckoutReceiptComponent, CheckoutReceiptOrderComponent, CheckoutReceiptPageComponent],
  imports: [RequisitionManagementExportsModule, SharedModule],
})
export class CheckoutReceiptPageModule {
  static component = CheckoutReceiptPageComponent;
}
