import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { MaintenancePageComponent } from './maintenance-page.component';

const maintenancePageRoutes: Routes = [
  { path: '', component: MaintenancePageComponent, data: { wrapperClass: 'errorpage', headerType: 'error' } },
];

@NgModule({
  declarations: [MaintenancePageComponent],
  imports: [RouterModule.forChild(maintenancePageRoutes), SharedModule],
})
export class MaintenancePageModule {}
