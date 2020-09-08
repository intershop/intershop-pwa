import { NgModule } from '@angular/core';
import { TreeviewModule } from 'ngx-treeview';

import { SharedModule } from 'ish-shared/shared.module';

import { BudgetWidgetComponent } from './components/budget-widget/budget-widget.component';
import { GroupFormComponent } from './components/hierarchies/group-form/group-form.component';
import { UserBudgetFormComponent } from './components/user-budget-form/user-budget-form.component';
import { UserBudgetComponent } from './components/user-budget/user-budget.component';
import { UserProfileFormComponent } from './components/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from './components/user-roles-selection/user-roles-selection.component';
import { HierarchiesCreateGroupPageComponent } from './pages/hierarchies-create-group/hierarchies-create-group-page.component';
import { HierarchiesPageComponent } from './pages/hierarchies/hierarchies-page.component';
import { OrganizationManagementStoreModule } from './store/organization-management-store.module';

const exportedComponents = [
  UserBudgetComponent,
  UserBudgetFormComponent,
  UserProfileFormComponent,
  UserRolesSelectionComponent,
];

@NgModule({
  declarations: [...exportedComponents, BudgetWidgetComponent, HierarchiesCreateGroupPageComponent, HierarchiesPageComponent],
  exports: [...exportedComponents],
  imports: [OrganizationManagementStoreModule, SharedModule, TreeviewModule.forRoot()],
})
export class OrganizationManagementModule {}
