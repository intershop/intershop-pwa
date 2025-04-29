import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { RequisitionsListModule } from '../../components/requisitions-list/requisitions-list.module';
import { RequisitionManagementModule } from '../../requisition-management.module';

import { ApproverPageComponent } from './approver-page.component';

const approverPageRoutes: Routes = [{ path: '', component: ApproverPageComponent }];

@NgModule({
  imports: [
    RequisitionManagementModule,
    RouterModule.forChild(approverPageRoutes),
    RequisitionsListModule,
    SharedModule,
  ],
  declarations: [ApproverPageComponent],
})
export class ApproverPageModule {}
