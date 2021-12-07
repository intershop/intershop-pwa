import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationToggleGuard } from 'ish-core/authorization-toggle.module';
import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';

import { FetchCostCentersGuard } from '../guards/fetch-cost-centers.guard';
import { FetchUsersGuard } from '../guards/fetch-users.guard';
import { RedirectFirstToParentGuard } from '../guards/redirect-first-to-parent.guard';

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
    canActivate: [FetchUsersGuard, AuthorizationToggleGuard],
  },
  {
    path: 'users/create',
    loadChildren: () => import('./user-create/user-create-page.module').then(m => m.UserCreatePageModule),
    data: { permission: 'APP_B2B_MANAGE_USERS' },
    canActivate: [RedirectFirstToParentGuard, AuthorizationToggleGuard],
  },
  {
    path: 'users/:B2BCustomerLogin',
    loadChildren: () => import('./user-detail/user-detail-page.module').then(m => m.UserDetailPageModule),
    canActivate: [FetchUsersGuard, AuthorizationToggleGuard],
    data: {
      onlyInitialUsers: true,
      permission: 'APP_B2B_MANAGE_USERS',
    },
  },
  {
    path: 'users/:B2BCustomerLogin/profile',
    loadChildren: () =>
      import('./user-edit-profile/user-edit-profile-page.module').then(m => m.UserEditProfilePageModule),
    canActivate: [RedirectFirstToParentGuard, AuthorizationToggleGuard],
    data: { permission: 'APP_B2B_MANAGE_USERS' },
  },
  {
    path: 'users/:B2BCustomerLogin/roles',
    loadChildren: () => import('./user-edit-roles/user-edit-roles-page.module').then(m => m.UserEditRolesPageModule),
    canActivate: [RedirectFirstToParentGuard, AuthorizationToggleGuard],
    data: { permission: 'APP_B2B_MANAGE_USERS' },
  },
  {
    path: 'users/:B2BCustomerLogin/budget',
    loadChildren: () => import('./user-edit-budget/user-edit-budget-page.module').then(m => m.UserEditBudgetPageModule),
    canActivate: [RedirectFirstToParentGuard, AuthorizationToggleGuard],
    data: { permission: 'APP_B2B_MANAGE_USERS' },
  },
  {
    path: 'cost-centers',
    canActivate: [FeatureToggleGuard, FetchCostCentersGuard],
    data: { feature: 'costCenters' },
    loadChildren: () => import('./cost-centers/cost-centers-page.module').then(m => m.CostCentersPageModule),
  },
  {
    path: 'cost-centers/create',
    loadChildren: () =>
      import('./cost-center-create/cost-center-create-page.module').then(m => m.CostCenterCreatePageModule),
    canActivate: [RedirectFirstToParentGuard],
  },
  {
    path: 'cost-centers/:CostCenterId',
    loadChildren: () =>
      import('./cost-center-detail/cost-center-detail-page.module').then(m => m.CostCenterDetailPageModule),
  },
  {
    path: 'cost-centers/:CostCenterId/edit',
    loadChildren: () => import('./cost-center-edit/cost-center-edit-page.module').then(m => m.CostCenterEditPageModule),
    canActivate: [RedirectFirstToParentGuard],
  },
  {
    path: 'cost-centers/:CostCenterId/buyers',
    loadChildren: () =>
      import('./cost-center-buyers/cost-center-buyers-page.module').then(m => m.CostCenterBuyersPageModule),
    canActivate: [RedirectFirstToParentGuard, FetchUsersGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationManagementRoutingModule {}
