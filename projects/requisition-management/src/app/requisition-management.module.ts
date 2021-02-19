import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { ApprovalWidgetComponent } from './components/approval-widget/approval-widget.component';
import { CheckoutReceiptRequisitionComponent } from './components/checkout-receipt-requisition/checkout-receipt-requisition.component';
import { RequisitionWidgetComponent } from './components/requisition-widget/requisition-widget.component';
import { RequisitionsListComponent } from './components/requisitions-list/requisitions-list.component';
import { RequisitionManagementStoreModule } from './store/requisition-management-store.module';

const exportedComponents = [RequisitionsListComponent];

const importExportModules = [NgbNavModule];

@NgModule({
  declarations: [
    ...exportedComponents,
    ApprovalWidgetComponent,
    CheckoutReceiptRequisitionComponent,
    RequisitionWidgetComponent,
  ],
  exports: [...exportedComponents, ...importExportModules],
  imports: [...importExportModules, CdkTableModule, RequisitionManagementStoreModule, SharedModule],
})
export class RequisitionManagementModule {}
