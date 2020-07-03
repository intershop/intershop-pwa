import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FetchUsersGuard } from '../guards/fetch-users.guard';

import { UserCreatePageComponent } from './user-create/user-create-page.component';
import { UserDetailPageComponent } from './user-detail/user-detail-page.component';
import { UserEditProfilePageComponent } from './user-edit-profile/user-edit-profile-page.component';
import { UsersPageComponent } from './users/users-page.component';

/**
 * routes for the organization management
 *
 * visible for testing
 */
export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users',
    component: UsersPageComponent,
    canActivate: [FetchUsersGuard],
  },
  {
    path: 'users/create',
    component: UserCreatePageComponent,
  },
  {
    path: 'users/:B2BCustomerLogin',
    component: UserDetailPageComponent,
    canActivate: [FetchUsersGuard],
    data: {
      onlyInitialUsers: true,
    },
  },
  {
    path: 'users/:B2BCustomerLogin/profile',
    component: UserEditProfilePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationManagementRoutingModule {}
