import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCenterDetailPageComponent } from './cost-center-detail-page.component';

const costCenterDetailPageRoutes: Routes = [{ path: '', component: CostCenterDetailPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(costCenterDetailPageRoutes), SharedModule],
  declarations: [CostCenterDetailPageComponent],
})
export class CostCenterDetailPageModule {}
