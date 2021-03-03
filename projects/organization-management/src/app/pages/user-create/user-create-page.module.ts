import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { UserCreatePageComponent } from './user-create-page.component';

const userCreatePageRoutes: Routes = [{ path: '', component: UserCreatePageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(userCreatePageRoutes), SharedModule],
  declarations: [UserCreatePageComponent],
})
export class UserCreatePageModule {}
