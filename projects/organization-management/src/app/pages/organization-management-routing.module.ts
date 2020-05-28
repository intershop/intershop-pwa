import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersDetailPageComponent } from './users-detail/users-detail-page.component';
import { UsersPageComponent } from './users/users-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersPageComponent, data: { breadcrumbData: [{ key: 'account.user.user_management' }] } },
  {
    path: 'users/:businessPartnerNo',
    component: UsersDetailPageComponent,
    data: { breadcrumbData: [{ key: 'USER DETAIL' }] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationManagementRoutingModule {}
