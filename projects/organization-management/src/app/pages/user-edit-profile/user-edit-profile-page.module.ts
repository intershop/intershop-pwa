import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { UserEditProfilePageComponent } from './user-edit-profile-page.component';

const userEditProfilePageRoutes: Routes = [{ path: '', component: UserEditProfilePageComponent }];

@NgModule({
  declarations: [UserEditProfilePageComponent],
  imports: [OrganizationManagementModule, RouterModule.forChild(userEditProfilePageRoutes), SharedModule],
})
export class UserEditProfilePageModule {}
