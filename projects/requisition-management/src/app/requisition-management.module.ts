import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { ApprovalWidgetComponent } from './components/approval-widget/approval-widget.component';
import { BudgetBarComponent } from './components/budget-bar/budget-bar.component';
import { CheckoutReceiptRequisitionComponent } from './components/checkout-receipt-requisition/checkout-receipt-requisition.component';
import { RequisitionBuyerApprovalComponent } from './components/requisition-buyer-approval/requisition-buyer-approval.component';
import { RequisitionRejectDialogComponent } from './components/requisition-reject-dialog/requisition-reject-dialog.component';
import { RequisitionSummaryComponent } from './components/requisition-summary/requisition-summary.component';
import { RequisitionWidgetComponent } from './components/requisition-widget/requisition-widget.component';
import { RequisitionsListComponent } from './components/requisitions-list/requisitions-list.component';
import { ApproverPageComponent } from './pages/approver/approver-page.component';
import { BuyerPageComponent } from './pages/buyer/buyer-page.component';
import { RequisitionDetailPageComponent } from './pages/requisition-detail/requisition-detail-page.component';
import { RequisitionManagementRoutingModule } from './pages/requisition-management-routing.module';
import { RequisitionManagementStoreModule } from './store/requisition-management-store.module';

@NgModule({
  declarations: [
    ApprovalWidgetComponent,
    ApproverPageComponent,
    BudgetBarComponent,
    BuyerPageComponent,
    CheckoutReceiptRequisitionComponent,
    RequisitionBuyerApprovalComponent,
    RequisitionDetailPageComponent,
    RequisitionRejectDialogComponent,
    RequisitionSummaryComponent,
    RequisitionWidgetComponent,
    RequisitionsListComponent,
  ],
  imports: [
    CdkTableModule,
    NgbNavModule,
    RequisitionManagementRoutingModule,
    RequisitionManagementStoreModule,
    SharedModule,
  ],
})
export class RequisitionManagementModule {}
