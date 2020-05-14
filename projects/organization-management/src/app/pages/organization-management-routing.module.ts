import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersDetailPageComponent } from './users-detail/users-detail-page.component';
import { UsersPageComponent } from './users/users-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersPageComponent },
  { path: 'users/:businessPartnerNo', component: UsersDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationManagementRoutingModule {}
