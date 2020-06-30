import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationManagementRoutingModule } from './pages/organization-management-routing.module';
import { UsersDetailPageComponent } from './pages/users-detail/users-detail-page.component';
import { UsersPageComponent } from './pages/users/users-page.component';
import { OrganizationManagementStoreModule } from './store/organization-management-store.module';

@NgModule({
  declarations: [UsersDetailPageComponent, UsersPageComponent],
  imports: [OrganizationManagementRoutingModule, OrganizationManagementStoreModule, SharedModule],
})
export class OrganizationManagementModule {}
