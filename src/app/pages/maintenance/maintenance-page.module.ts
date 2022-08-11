import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { MaintenancePageComponent } from './maintenance-page.component';

const maintenancePageRoutes: Routes = [
  { path: '', component: MaintenancePageComponent, data: { wrapperClass: 'maintenancepage', headerType: 'simple' } },
];

@NgModule({
  imports: [RouterModule.forChild(maintenancePageRoutes), SharedModule],
  declarations: [MaintenancePageComponent],
  exports: [MaintenancePageComponent],
})
export class MaintenancePageModule {}
