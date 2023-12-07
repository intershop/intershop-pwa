import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { HierarchiesPageComponent } from './hierarchies-page.component';

const hierarchiesRoutes: Routes = [{ path: '', component: HierarchiesPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(hierarchiesRoutes), SharedModule],
  declarations: [HierarchiesPageComponent],
})
export class HierarchiesPageModule {}
