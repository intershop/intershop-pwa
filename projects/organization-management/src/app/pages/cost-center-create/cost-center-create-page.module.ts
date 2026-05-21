import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCenterCreatePageComponent } from './cost-center-create-page.component';
import { CostCenterCsvImportComponent } from './cost-center-csv-import/cost-center-csv-import.component';

const costCenterCreatePageRoutes: Routes = [{ path: '', component: CostCenterCreatePageComponent }];

@NgModule({
  declarations: [CostCenterCreatePageComponent, CostCenterCsvImportComponent],
  imports: [OrganizationManagementModule, RouterModule.forChild(costCenterCreatePageRoutes), SharedModule],
})
export class CostCenterCreatePageModule {}
