import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationHierarchiesModule } from '../../organization-hierarchies.module';

import { HierarchiesPageComponent } from './hierarchies-page.component';

const hierarchiesRoutes: Routes = [{ path: '', component: HierarchiesPageComponent }];

@NgModule({
  imports: [OrganizationHierarchiesModule, RouterModule.forChild(hierarchiesRoutes), SharedModule],
  declarations: [HierarchiesPageComponent],
})
export class HierarchiesPageModule {}
