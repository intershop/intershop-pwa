import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCenterCreatePageComponent } from './cost-center-create-page.component';

const costCenterCreatePageRoutes: Routes = [{ path: '', component: CostCenterCreatePageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(costCenterCreatePageRoutes), SharedModule],
  declarations: [CostCenterCreatePageComponent],
})
export class CostCenterCreatePageModule {}
