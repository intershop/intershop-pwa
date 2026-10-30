import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCenterEditPageComponent } from './cost-center-edit-page.component';

const costCenterEditPageRoutes: Routes = [{ path: '', component: CostCenterEditPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(costCenterEditPageRoutes), SharedModule],
  declarations: [CostCenterEditPageComponent],
})
export class CostCenterEditPageModule {}
