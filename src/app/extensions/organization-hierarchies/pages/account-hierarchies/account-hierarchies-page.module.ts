// eslint-disable-next-line ish-custom-rules/ordered-imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

// eslint-disable-next-line ish-custom-rules/ban-imports-file-pattern
import { OrganizationHierarchiesGroupFormComponent } from '../../shared/component/organization-hierarchies-group-form/organization-hierarchies-group-form.component';

import { OrganizationHierarchiesStoreModule } from '../../store/organization-hierarchies-store.module';

import { AccountHierarchiesPageComponent } from './account-hierarchies-page.component';
import { AccountHierarchiesComponent } from './account-hierarchies/account-hierarchies.component';
// eslint-disable-next-line ish-custom-rules/ban-imports-file-pattern
import { OrganizationHierarchiesCreateGroupComponent } from '../../shared/component/organization-hierarchies-create-group/organization-hierarchies-create-group.component';

const hierarchiesRoutes: Routes = [{ path: '', component: AccountHierarchiesPageComponent }];

@NgModule({
  imports: [OrganizationHierarchiesStoreModule, RouterModule.forChild(hierarchiesRoutes), SharedModule],
  declarations: [
    AccountHierarchiesComponent,
    AccountHierarchiesPageComponent,
    OrganizationHierarchiesCreateGroupComponent,
    OrganizationHierarchiesGroupFormComponent,
  ],
  exports: [OrganizationHierarchiesCreateGroupComponent, OrganizationHierarchiesGroupFormComponent],
})
export class AccountHierarchiesPageModule {}
