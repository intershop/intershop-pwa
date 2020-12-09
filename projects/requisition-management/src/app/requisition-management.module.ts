import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { RequisitionSummaryComponent } from './components/requisition-summary/requisition-summary.component';
import { RequisitionsListComponent } from './components/requisitions-list/requisitions-list.component';
import { ApproverPageComponent } from './pages/approver/approver-page.component';
import { BuyerPageComponent } from './pages/buyer/buyer-page.component';
import { RequisitionDetailPageComponent } from './pages/requisition-detail/requisition-detail-page.component';
import { RequisitionManagementRoutingModule } from './pages/requisition-management-routing.module';
import { RequisitionManagementStoreModule } from './store/requisition-management-store.module';

@NgModule({
  declarations: [
    ApproverPageComponent,
    BuyerPageComponent,
    RequisitionDetailPageComponent,
    RequisitionSummaryComponent,
    RequisitionsListComponent,
  ],
  imports: [RequisitionManagementRoutingModule, RequisitionManagementStoreModule, SharedModule],
})
export class RequisitionManagementModule {}
