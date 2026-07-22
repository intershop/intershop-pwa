import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCentersFilterComponent } from './cost-centers-filter/cost-centers-filter.component';
import { CostCentersPageComponent } from './cost-centers-page.component';

const costCentersPageRoutes: Routes = [{ path: '', component: CostCentersPageComponent }];

@NgModule({
  declarations: [CostCentersFilterComponent, CostCentersPageComponent],
  imports: [OrganizationManagementModule, RouterModule.forChild(costCentersPageRoutes), SharedModule],
})
export class CostCentersPageModule {}
