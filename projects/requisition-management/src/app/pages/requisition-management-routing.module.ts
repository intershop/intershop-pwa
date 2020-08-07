import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApproverPageComponent } from './approver/approver-page.component';
import { BuyerPageComponent } from './buyer/buyer-page.component';
import { RequisitionDetailPageComponent } from './requisition-detail/requisition-detail-page.component';

/**
 * routes for the requisition management
 *
 * visible for testing
 */
export const routes: Routes = [
  { path: 'approver', component: ApproverPageComponent },
  { path: 'buyer', component: BuyerPageComponent },
  { path: 'approver/:requisitionId', component: RequisitionDetailPageComponent },
  { path: 'buyer/:requisitionId', component: RequisitionDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequisitionManagementRoutingModule {}
