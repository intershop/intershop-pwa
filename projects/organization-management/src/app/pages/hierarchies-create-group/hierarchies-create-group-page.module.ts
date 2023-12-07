import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { HierarchiesCreateGroupPageComponent } from './hierarchies-create-group-page.component';

const hierarchiesRoutes: Routes = [{ path: '', component: HierarchiesCreateGroupPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(hierarchiesRoutes), SharedModule],
  declarations: [HierarchiesCreateGroupPageComponent],
})
export class HierarchiesCreateGroupPageModule {}
