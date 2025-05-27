import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCentersPageComponent } from './cost-centers-page.component';

const costCentersPageRoutes: Routes = [{ path: '', component: CostCentersPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(costCentersPageRoutes), SharedModule],
  declarations: [CostCentersPageComponent],
})
export class CostCentersPageModule {}
