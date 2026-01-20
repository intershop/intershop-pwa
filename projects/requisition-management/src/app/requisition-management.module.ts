import { NgModule } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { ApprovalWidgetComponent } from './components/approval-widget/approval-widget.component';
import { CheckoutReceiptRequisitionComponent } from './components/checkout-receipt-requisition/checkout-receipt-requisition.component';
import { RequisitionRejectDialogComponent } from './components/requisition-reject-dialog/requisition-reject-dialog.component';
import { RequisitionWidgetComponent } from './components/requisition-widget/requisition-widget.component';
import { RequisitionsListComponent } from './components/requisitions-list/requisitions-list.component';
import { RequisitionManagementExportsModule } from './exports/requisition-management-exports.module';
import { RequisitionManagementStoreModule } from './store/requisition-management-store.module';

@NgModule({
  imports: [
    ApprovalWidgetComponent,
    CheckoutReceiptRequisitionComponent,
    NgbNavModule,
    RequisitionManagementExportsModule,
    RequisitionManagementStoreModule,
    RequisitionRejectDialogComponent,
    RequisitionsListComponent,
    RequisitionWidgetComponent,
  ],
  exports: [NgbNavModule, RequisitionRejectDialogComponent, RequisitionsListComponent],
})
export class RequisitionManagementModule {}
