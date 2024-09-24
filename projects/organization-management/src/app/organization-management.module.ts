import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BudgetInfoComponent } from './components/budget-info/budget-info.component';
import { BudgetWidgetComponent } from './components/budget-widget/budget-widget.component';
import { BuyersSelectComponent } from './components/buyers-select/buyers-select.component';
import { CostCenterBudgetComponent } from './components/cost-center-budget/cost-center-budget.component';
import { CostCenterBuyerEditDialogComponent } from './components/cost-center-buyer-edit-dialog/cost-center-buyer-edit-dialog.component';
import { CostCenterFormComponent } from './components/cost-center-form/cost-center-form.component';
import { CostCenterUsersListComponent } from './components/cost-center-users-list/cost-center-users-list.component';
import { CostCenterWidgetComponent } from './components/cost-center-widget/cost-center-widget.component';
import { UserBudgetFormComponent } from './components/user-budget-form/user-budget-form.component';
import { UserBudgetComponent } from './components/user-budget/user-budget.component';
import { UserProfileFormComponent } from './components/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from './components/user-roles-selection/user-roles-selection.component';
import { OrganizationManagementStoreModule } from './store/organization-management-store.module';

const exportedComponents = [
  BuyersSelectComponent,
  BudgetInfoComponent,
  CostCenterBudgetComponent,
  CostCenterBuyerEditDialogComponent,
  CostCenterFormComponent,
  CostCenterUsersListComponent,
  UserBudgetComponent,
  UserBudgetFormComponent,
  UserProfileFormComponent,
  UserRolesSelectionComponent,
];

@NgModule({
  declarations: [...exportedComponents, BudgetWidgetComponent, CostCenterWidgetComponent],
  exports: [...exportedComponents],
  imports: [OrganizationManagementStoreModule, SharedModule],
})
export class OrganizationManagementModule {}
