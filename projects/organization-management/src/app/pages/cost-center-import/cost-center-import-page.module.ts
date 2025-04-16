import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { CostCenterImportPageComponent } from './cost-center-import-page.component';

const costCenterImportPageRoutes: Routes = [{ path: '', component: CostCenterImportPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(costCenterImportPageRoutes), OrganizationManagementModule, SharedModule],
  declarations: [CostCenterImportPageComponent],
})
export class CostCenterImportPageModule {}
