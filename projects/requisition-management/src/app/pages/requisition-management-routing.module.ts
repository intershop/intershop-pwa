import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApproverPageComponent } from './approver/approver-page.component';
import { BuyerPageComponent } from './buyer/buyer-page.component';

/**
 * routes for the requisition management
 *
 * visible for testing
 */
export const routes: Routes = [
  { path: 'approver', redirectTo: 'approver/pending', pathMatch: 'full' },
  { path: 'approver/:status', component: ApproverPageComponent },
  { path: 'buyer', redirectTo: 'buyer/pending', pathMatch: 'full' },
  { path: 'buyer/:status', component: BuyerPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequisitionManagementRoutingModule {}
