import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { UsersPageComponent } from './users-page.component';

const usersPageRoutes: Routes = [{ path: '', component: UsersPageComponent }];

@NgModule({
  declarations: [UsersPageComponent],
  imports: [OrganizationManagementModule, RouterModule.forChild(usersPageRoutes), SharedModule],
})
export class UsersPageModule {}
