import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { MaintenancePageComponent } from './maintenance-page.component';

const maintenancePageRoutes: Routes = [
  { path: '', component: MaintenancePageComponent, data: { wrapperClass: 'errorpage', headerType: 'error' } },
];

@NgModule({
  imports: [RouterModule.forChild(maintenancePageRoutes), SharedModule],
  declarations: [MaintenancePageComponent],
})
export class MaintenancePageModule {}
