import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authorizationToggleGuard } from 'ish-core/authorization-toggle.module';
import { featureToggleGuard } from 'ish-core/feature-toggle.module';

import { fetchCostCentersGuard } from '../guards/fetch-cost-centers.guard';
import { fetchHierachiesGroupsGuard } from '../guards/fetch-hierachies-groups.guard';
import { fetchUsersGuard } from '../guards/fetch-users.guard';
import { redirectFirstToParentGuard } from '../guards/redirect-first-to-parent.guard';

import { HierarchiesCreateGroupPageComponent } from './hierarchies-create-group/hierarchies-create-group-page.component';

/**
 * routes for the organization management
 *
 * visible for testing
 */
export const routes: Routes = [
  { path: '', redirectTo: 'cost-centers', pathMatch: 'full' },
  {
    path: 'users',
    loadChildren: () => import('./users/users-page.module').then(m => m.UsersPageModule),
    data: { permission: 'APP_B2B_MANAGE_USERS' },
    canActivate: [fetchUsersGuard, authorizationToggleGuard],
  },
  {
    path: 'users/create',
    loadChildren: () => import('./user-create/user-create-page.module').then(m => m.UserCreatePageModule),
    data: { permission: 'APP_B2B_MANAGE_USERS' },
    canActivate: [redirectFirstToParentGuard, authorizationToggleGuard],
  },
  {
    path: 'users/:B2BCustomerLogin',
    loadChildren: () => import('./user-detail/user-detail-page.module').then(m => m.UserDetailPageModule),
    canActivate: [fetchUsersGuard, authorizationToggleGuard],
    data: {
      onlyInitialUsers: true,
      permission: 'APP_B2B_MANAGE_USERS',
    },
  },
  {
    path: 'users/:B2BCustomerLogin/profile',
    loadChildren: () =>
      import('./user-edit-profile/user-edit-profile-page.module').then(m => m.UserEditProfilePageModule),
    canActivate: [redirectFirstToParentGuard, authorizationToggleGuard],
    data: { permission: 'APP_B2B_MANAGE_USERS' },
  },
  {
    path: 'users/:B2BCustomerLogin/roles',
    loadChildren: () => import('./user-edit-roles/user-edit-roles-page.module').then(m => m.UserEditRolesPageModule),
    canActivate: [redirectFirstToParentGuard, authorizationToggleGuard],
    data: { permission: 'APP_B2B_MANAGE_USERS' },
  },
  {
    path: 'users/:B2BCustomerLogin/budget',
    loadChildren: () => import('./user-edit-budget/user-edit-budget-page.module').then(m => m.UserEditBudgetPageModule),
    canActivate: [redirectFirstToParentGuard, authorizationToggleGuard],
    data: { permission: 'APP_B2B_MANAGE_USERS' },
  },
  {
    path: 'cost-centers',
    canActivate: [featureToggleGuard, fetchCostCentersGuard],
    data: { feature: 'costCenters' },
    loadChildren: () => import('./cost-centers/cost-centers-page.module').then(m => m.CostCentersPageModule),
  },
  {
    path: 'cost-centers/create',
    loadChildren: () =>
      import('./cost-center-create/cost-center-create-page.module').then(m => m.CostCenterCreatePageModule),
    canActivate: [redirectFirstToParentGuard],
  },
  {
    path: 'cost-centers/:CostCenterId',
    loadChildren: () =>
      import('./cost-center-detail/cost-center-detail-page.module').then(m => m.CostCenterDetailPageModule),
  },
  {
    path: 'cost-centers/:CostCenterId/edit',
    loadChildren: () => import('./cost-center-edit/cost-center-edit-page.module').then(m => m.CostCenterEditPageModule),
    canActivate: [redirectFirstToParentGuard],
  },
  {
    path: 'cost-centers/:CostCenterId/buyers',
    loadChildren: () =>
      import('./cost-center-buyers/cost-center-buyers-page.module').then(m => m.CostCenterBuyersPageModule),
    canActivate: [redirectFirstToParentGuard, fetchUsersGuard],
  },
  {
    path: 'hierarchies',
    loadChildren: () => import('./hierarchies/hierarchies-page.module').then(m => m.HierarchiesPageModule),
    canActivate: [featureToggleGuard, fetchHierachiesGroupsGuard],
    data: { feature: 'organizationHierarchies' },
  },
  {
    path: 'hierarchies/create-group',
    component: HierarchiesCreateGroupPageComponent,
    canActivate: [featureToggleGuard],
    data: { feature: 'organizationHierarchies' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationManagementRoutingModule {}
