import { NgModule } from '@angular/core';

import { LazyApprovalWidgetComponent } from './lazy-approval-widget/lazy-approval-widget.component';
import { LazyCheckoutReceiptRequisitionComponent } from './lazy-checkout-receipt-requisition/lazy-checkout-receipt-requisition.component';
import { LazyRequisitionWidgetComponent } from './lazy-requisition-widget/lazy-requisition-widget.component';

@NgModule({
  declarations: [LazyApprovalWidgetComponent, LazyCheckoutReceiptRequisitionComponent, LazyRequisitionWidgetComponent],
  exports: [LazyApprovalWidgetComponent, LazyCheckoutReceiptRequisitionComponent, LazyRequisitionWidgetComponent],
})
export class RequisitionManagementExportsModule {}
