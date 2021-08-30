import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BudgetWidgetComponent } from './components/budget-widget/budget-widget.component';
import { GroupFormComponent } from './components/group-form/group-form.component';
import { UserBudgetFormComponent } from './components/user-budget-form/user-budget-form.component';
import { UserBudgetComponent } from './components/user-budget/user-budget.component';
import { UserProfileFormComponent } from './components/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from './components/user-roles-selection/user-roles-selection.component';
import { HierarchiesCreateGroupPageComponent } from './pages/hierarchies-create-group/hierarchies-create-group-page.component';
import { OrganizationManagementStoreModule } from './store/organization-management-store.module';

const exportedComponents = [
  UserBudgetComponent,
  UserBudgetFormComponent,
  UserProfileFormComponent,
  UserRolesSelectionComponent,
];

@NgModule({
  declarations: [
    ...exportedComponents,
    BudgetWidgetComponent,
    GroupFormComponent,
    HierarchiesCreateGroupPageComponent,
  ],
  exports: [...exportedComponents],
  imports: [OrganizationManagementStoreModule, SharedModule],
})
export class OrganizationManagementModule { }
