import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { UserCreatePageComponent } from './user-create-page.component';
import { UserCsvImportComponent } from './user-csv-import/user-csv-import.component';

const userCreatePageRoutes: Routes = [{ path: '', component: UserCreatePageComponent }];

@NgModule({
  declarations: [UserCreatePageComponent, UserCsvImportComponent],
  imports: [OrganizationManagementModule, RouterModule.forChild(userCreatePageRoutes), SharedModule],
})
export class UserCreatePageModule {}
