import { NgModule } from '@angular/core';
import { TreeviewModule } from 'ngx-treeview';

import { SharedModule } from 'ish-shared/shared.module';

import { GroupFormComponent } from './components/hierarchies/group-form/group-form.component';
import { UserProfileFormComponent } from './components/user/user-profile-form/user-profile-form.component';
import { UserRolesSelectionComponent } from './components/user/user-roles-selection/user-roles-selection.component';
import { HierarchiesCreateGroupPageComponent } from './pages/hierarchies-create-group/hierarchies-create-group-page.component';
import { HierarchiesPageComponent } from './pages/hierarchies/hierarchies-page.component';
import { OrganizationManagementRoutingModule } from './pages/organization-management-routing.module';
import { UserCreatePageComponent } from './pages/user-create/user-create-page.component';
import { UserDetailPageComponent } from './pages/user-detail/user-detail-page.component';
import { UserEditProfilePageComponent } from './pages/user-edit-profile/user-edit-profile-page.component';
import { UserEditRolesPageComponent } from './pages/user-edit-roles/user-edit-roles-page.component';
import { UserRolesBadgesComponent } from './pages/users/user-roles-badges/user-roles-badges.component';
import { UsersPageComponent } from './pages/users/users-page.component';
import { OrganizationManagementStoreModule } from './store/organization-management-store.module';

@NgModule({
  declarations: [
    GroupFormComponent,
    HierarchiesCreateGroupPageComponent,
    HierarchiesPageComponent,
    UserCreatePageComponent,
    UserDetailPageComponent,
    UserEditProfilePageComponent,
    UserEditRolesPageComponent,
    UserProfileFormComponent,
    UserRolesBadgesComponent,
    UserRolesSelectionComponent,
    UsersPageComponent,
  ],
  imports: [
    OrganizationManagementRoutingModule,
    OrganizationManagementStoreModule,
    SharedModule,
    TreeviewModule.forRoot(),
  ],
})
export class OrganizationManagementModule {}
