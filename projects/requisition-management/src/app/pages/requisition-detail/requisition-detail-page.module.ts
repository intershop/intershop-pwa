import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { RequisitionManagementModule } from '../../requisition-management.module';

import { BudgetBarComponent } from './budget-bar/budget-bar.component';
import { RequisitionBuyerApprovalComponent } from './requisition-buyer-approval/requisition-buyer-approval.component';
import { RequisitionDetailPageComponent } from './requisition-detail-page.component';
import { RequisitionRejectDialogComponent } from './requisition-reject-dialog/requisition-reject-dialog.component';
import { RequisitionSummaryComponent } from './requisition-summary/requisition-summary.component';

const requisitionDetailPageRoutes: Routes = [{ path: '', component: RequisitionDetailPageComponent }];

@NgModule({
  imports: [RequisitionManagementModule, RouterModule.forChild(requisitionDetailPageRoutes), SharedModule],
  declarations: [
    BudgetBarComponent,
    RequisitionBuyerApprovalComponent,
    RequisitionDetailPageComponent,
    RequisitionRejectDialogComponent,
    RequisitionSummaryComponent,
  ],
})
export class RequisitionDetailPageModule {}
