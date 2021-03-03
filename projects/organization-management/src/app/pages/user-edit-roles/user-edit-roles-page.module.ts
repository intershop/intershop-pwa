import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { UserEditRolesPageComponent } from './user-edit-roles-page.component';

const userEditRolesPageRoutes: Routes = [{ path: '', component: UserEditRolesPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(userEditRolesPageRoutes), SharedModule],
  declarations: [UserEditRolesPageComponent],
})
export class UserEditRolesPageModule {}
