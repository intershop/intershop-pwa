import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


/**
 * routes for the requisition management
 *
 * visible for testing
 */
export const routes: Routes = [
  {
    path: 'approver',
    data: {
      meta: {
        title: 'account.requisitions.approvals',
        robots: 'noindex, nofollow',
      },
    },
    loadComponent: () => import('./approver/approver-page.component').then(m => m.ApproverPageComponent),
  },
  {
    path: 'buyer',
    loadComponent: () => import('./buyer/buyer-page.component').then(m => m.BuyerPageComponent),
  },
  {
    path: 'approver/:requisitionId',
    data: {
      meta: {
        title: 'account.requisitions.approvals',
        robots: 'noindex, nofollow',
      },
    },
    loadComponent: () =>
      import('./requisition-detail/requisition-detail-page.component').then(m => m.RequisitionDetailPageComponent),
  },
  {
    path: 'buyer/:requisitionId',
    loadComponent: () =>
      import('./requisition-detail/requisition-detail-page.component').then(m => m.RequisitionDetailPageComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  // Store is now registered globally via app.config.ts to allow reuse on checkout receipt, so no providers here.
  providers: [],
})
export class RequisitionManagementRoutingModule {}
