import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BudgetWidgetComponent } from './components/budget-widget/budget-widget.component';
import { UserBudgetFormComponent } from './components/user-budget-form/user-budget-form.component';
import { UserBudgetComponent } from './components/user-budget/user-budget.component';
import { UserProfileFormComponent } from './components/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from './components/user-roles-selection/user-roles-selection.component';
import { OrganizationManagementStoreModule } from './store/organization-management-store.module';

const exportedComponents = [
  UserBudgetComponent,
  UserBudgetFormComponent,
  UserProfileFormComponent,
  UserRolesSelectionComponent,
];

@NgModule({
  declarations: [...exportedComponents, BudgetWidgetComponent],
  exports: [...exportedComponents],
  imports: [OrganizationManagementStoreModule, SharedModule],
})
export class OrganizationManagementModule {}
