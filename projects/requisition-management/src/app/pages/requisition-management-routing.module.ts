import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * routes for the requisition management
 *
 * visible for testing
 */
export const routes: Routes = [
  { path: 'approver', loadChildren: () => import('./approver/approver-page.module').then(m => m.ApproverPageModule) },
  { path: 'buyer', loadChildren: () => import('./buyer/buyer-page.module').then(m => m.BuyerPageModule) },
  {
    path: 'approver/:requisitionId',
    loadChildren: () =>
      import('./requisition-detail/requisition-detail-page.module').then(m => m.RequisitionDetailPageModule),
  },
  {
    path: 'buyer/:requisitionId',
    loadChildren: () =>
      import('./requisition-detail/requisition-detail-page.module').then(m => m.RequisitionDetailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequisitionManagementRoutingModule {}
