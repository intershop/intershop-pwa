import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { UserImportPageComponent } from './user-import-page.component';

const userImportPageRoutes: Routes = [{ path: '', component: UserImportPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(userImportPageRoutes), OrganizationManagementModule, SharedModule],
  declarations: [UserImportPageComponent],
})
export class UserImportPageModule {}
