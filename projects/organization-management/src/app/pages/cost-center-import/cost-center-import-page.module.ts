import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CostCenterImportPageComponent } from './cost-center-import-page.component';

const costCenterImportPageRoutes: Routes = [{ path: '', component: CostCenterImportPageComponent }];

@NgModule({
  declarations: [CostCenterImportPageComponent],
  imports: [RouterModule.forChild(costCenterImportPageRoutes), SharedModule],
})
export class CostCenterImportPageModule {}
