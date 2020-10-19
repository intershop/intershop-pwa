import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BudgetWidgetComponent } from './components/budget-widget/budget-widget.component';
import { UserBudgetFormComponent } from './components/user-budget-form/user-budget-form.component';
import { UserBudgetComponent } from './components/user-budget/user-budget.component';
import { UserProfileFormComponent } from './components/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from './components/user-roles-selection/user-roles-selection.component';
import { OrganizationManagementRoutingModule } from './pages/organization-management-routing.module';
import { UserCreatePageComponent } from './pages/user-create/user-create-page.component';
import { UserDetailBudgetComponent } from './pages/user-detail/user-detail-budget/user-detail-budget.component';
import { UserDetailPageComponent } from './pages/user-detail/user-detail-page.component';
import { UserEditBudgetPageComponent } from './pages/user-edit-budget/user-edit-budget-page.component';
import { UserEditProfilePageComponent } from './pages/user-edit-profile/user-edit-profile-page.component';
import { UserEditRolesPageComponent } from './pages/user-edit-roles/user-edit-roles-page.component';
import { UserRolesBadgesComponent } from './pages/users/user-roles-badges/user-roles-badges.component';
import { UsersPageComponent } from './pages/users/users-page.component';
import { OrganizationManagementStoreModule } from './store/organization-management-store.module';

@NgModule({
  declarations: [
    BudgetWidgetComponent,
    UserBudgetComponent,
    UserBudgetFormComponent,
    UserCreatePageComponent,
    UserDetailBudgetComponent,
    UserDetailPageComponent,
    UserEditBudgetPageComponent,
    UserEditProfilePageComponent,
    UserEditRolesPageComponent,
    UserProfileFormComponent,
    UserRolesBadgesComponent,
    UserRolesSelectionComponent,
    UsersPageComponent,
  ],
  imports: [OrganizationManagementRoutingModule, OrganizationManagementStoreModule, SharedModule],
})
export class OrganizationManagementModule {}
