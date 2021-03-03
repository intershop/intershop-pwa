import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { RequisitionManagementModule } from '../../requisition-management.module';

import { ApproverPageComponent } from './approver-page.component';

const approverPageRoutes: Routes = [{ path: '', component: ApproverPageComponent }];

@NgModule({
  imports: [RequisitionManagementModule, RouterModule.forChild(approverPageRoutes), SharedModule],
  declarations: [ApproverPageComponent],
})
export class ApproverPageModule {}
