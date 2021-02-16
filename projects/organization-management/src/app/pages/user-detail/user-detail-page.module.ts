import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementModule } from '../../organization-management.module';

import { UserDetailBudgetComponent } from './user-detail-budget/user-detail-budget.component';
import { UserDetailPageComponent } from './user-detail-page.component';

const userDetailPageRoutes: Routes = [{ path: '', component: UserDetailPageComponent }];

@NgModule({
  imports: [OrganizationManagementModule, RouterModule.forChild(userDetailPageRoutes), SharedModule],
  declarations: [UserDetailBudgetComponent, UserDetailPageComponent],
})
export class UserDetailPageModule {}
