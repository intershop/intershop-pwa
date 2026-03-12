import { Routes } from '@angular/router';
import { provideFormlyConfig } from '@ngx-formly/core';

import { authorizationToggleGuard } from 'ish-core/authorization-toggle';
import { featureToggleGuard } from 'ish-core/feature-toggle';

import { fetchUsersGuard } from '../guards/fetch-users.guard';
import { redirectFirstToParentGuard } from '../guards/redirect-first-to-parent.guard';
import { provideOrganizationManagementStore } from '../store/organization-management-store.providers';

import { CostCenterBuyersRepeatFieldComponent } from './cost-center-buyers/cost-center-buyers-repeat-field/cost-center-buyers-repeat-field.component';

/**
 * routes for the organization management
 *
 * visible for testing
 */
export const routes: Routes = [
  {
    path: '',
    providers: [provideOrganizationManagementStore()],
    children: [
      { path: '', redirectTo: 'cost-centers', pathMatch: 'full' },
      {
        path: 'settings',
        loadComponent: () =>
          import('./organization-settings/organization-settings-page.component').then(
            m => m.OrganizationSettingsPageComponent
          ),
        data: {
          meta: {
            title: 'account.organization.org_settings',
            robots: 'noindex, nofollow',
          },
          permission: 'APP_B2B_MANAGE_USERS',
        },
        canActivate: [authorizationToggleGuard],
      },
      {
        path: 'settings/company',
        loadComponent: () =>
          import('./organization-settings-company/organization-settings-company-page.component').then(
            m => m.OrganizationSettingsCompanyPageComponent
          ),
        data: { permission: 'APP_B2B_MANAGE_USERS' },
        canActivate: [authorizationToggleGuard],
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users-page.component').then(m => m.UsersPageComponent),
        data: {
          meta: {
            title: 'account.organization.user_management',
            robots: 'noindex, nofollow',
          },
          permission: 'APP_B2B_MANAGE_USERS',
        },
        canActivate: [fetchUsersGuard, authorizationToggleGuard],
      },
      {
        path: 'users/create',
        loadComponent: () => import('./user-create/user-create-page.component').then(m => m.UserCreatePageComponent),
        data: { permission: 'APP_B2B_MANAGE_USERS' },
        canActivate: [redirectFirstToParentGuard, authorizationToggleGuard],
      },
      {
        path: 'users/import',
        loadComponent: () => import('./user-import/user-import-page.component').then(m => m.UserImportPageComponent),
        data: { permission: 'APP_B2B_MANAGE_USERS' },
        canActivate: [redirectFirstToParentGuard, authorizationToggleGuard],
      },
      {
        path: 'users/:B2BCustomerLogin',
        loadComponent: () => import('./user-detail/user-detail-page.component').then(m => m.UserDetailPageComponent),
        canActivate: [fetchUsersGuard, authorizationToggleGuard],
        data: {
          onlyInitialUsers: true,
          permission: 'APP_B2B_MANAGE_USERS',
        },
      },
      {
        path: 'users/:B2BCustomerLogin/profile',
        loadComponent: () =>
          import('./user-edit-profile/user-edit-profile-page.component').then(m => m.UserEditProfilePageComponent),
        canActivate: [redirectFirstToParentGuard, authorizationToggleGuard],
        data: { permission: 'APP_B2B_MANAGE_USERS' },
      },
      {
        path: 'users/:B2BCustomerLogin/roles',
        loadComponent: () =>
          import('./user-edit-roles/user-edit-roles-page.component').then(m => m.UserEditRolesPageComponent),
        canActivate: [redirectFirstToParentGuard, authorizationToggleGuard],
        data: { permission: 'APP_B2B_MANAGE_USERS' },
      },
      {
        path: 'users/:B2BCustomerLogin/budget',
        loadComponent: () =>
          import('./user-edit-budget/user-edit-budget-page.component').then(m => m.UserEditBudgetPageComponent),
        canActivate: [redirectFirstToParentGuard, authorizationToggleGuard],
        data: { permission: 'APP_B2B_MANAGE_USERS' },
      },
      {
        path: 'cost-centers',
        canActivate: [featureToggleGuard],
        data: {
          meta: {
            title: 'account.organization.cost_center_management',
            robots: 'noindex, nofollow',
          },
          feature: 'costCenters',
        },
        loadComponent: () => import('./cost-centers/cost-centers-page.component').then(m => m.CostCentersPageComponent),
      },
      {
        path: 'cost-centers/create',
        loadComponent: () =>
          import('./cost-center-create/cost-center-create-page.component').then(m => m.CostCenterCreatePageComponent),
        canActivate: [redirectFirstToParentGuard],
      },
      {
        path: 'cost-centers/import',
        loadComponent: () =>
          import('./cost-center-import/cost-center-import-page.component').then(m => m.CostCenterImportPageComponent),
        canActivate: [redirectFirstToParentGuard],
      },
      {
        path: 'cost-centers/:CostCenterId',
        loadComponent: () =>
          import('./cost-center-detail/cost-center-detail-page.component').then(m => m.CostCenterDetailPageComponent),
      },
      {
        path: 'cost-centers/:CostCenterId/edit',
        loadComponent: () =>
          import('./cost-center-edit/cost-center-edit-page.component').then(m => m.CostCenterEditPageComponent),
        canActivate: [redirectFirstToParentGuard],
      },
      {
        path: 'cost-centers/:CostCenterId/buyers',
        loadComponent: () =>
          import('./cost-center-buyers/cost-center-buyers-page.component').then(m => m.CostCenterBuyersPageComponent),
        canActivate: [redirectFirstToParentGuard, fetchUsersGuard],
        providers: [
          provideFormlyConfig({
            types: [{ name: 'repeatCostCenterBuyers', component: CostCenterBuyersRepeatFieldComponent }],
          }),
        ],
      },
    ],
  },
];

export const organizationManagementRoutes = routes;

