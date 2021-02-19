import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { UserRolesBadgesComponent } from './user-roles-badges/user-roles-badges.component';
import { UsersPageComponent } from './users-page.component';

const usersPageRoutes: Routes = [{ path: '', component: UsersPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(usersPageRoutes), SharedModule],
  declarations: [UserRolesBadgesComponent, UsersPageComponent],
})
export class UsersPageModule {}
