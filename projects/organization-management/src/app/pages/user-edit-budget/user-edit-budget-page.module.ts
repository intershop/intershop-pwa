import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { UserEditBudgetPageComponent } from './user-edit-budget-page.component';

const userEditBudgetPageRoutes: Routes = [{ path: '', component: UserEditBudgetPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(userEditBudgetPageRoutes), SharedModule],
  declarations: [UserEditBudgetPageComponent],
})
export class UserEditBudgetPageModule {}
