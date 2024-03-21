// eslint-disable-next-line ish-custom-rules/ordered-imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

// eslint-disable-next-line ish-custom-rules/ban-imports-file-pattern
import { GroupFormComponent } from '../../shared/component/group-form/group-form.component';
// eslint-disable-next-line ish-custom-rules/ban-imports-file-pattern
import { HierarchiesCreateGroupComponent } from '../../shared/component/hierarchies-create-group/hierarchies-create-group.component';
import { OrganizationHierarchiesStoreModule } from '../../store/organization-hierarchies-store.module';

import { AccountHierarchiesPageComponent } from './account-hierarchies-page.component';
import { AccountHierarchiesComponent } from './account-hierarchies/account-hierarchies.component';

const hierarchiesRoutes: Routes = [{ path: '', component: AccountHierarchiesPageComponent }];

@NgModule({
  imports: [OrganizationHierarchiesStoreModule, RouterModule.forChild(hierarchiesRoutes), SharedModule],
  declarations: [
    AccountHierarchiesComponent,
    AccountHierarchiesPageComponent,
    GroupFormComponent,
    HierarchiesCreateGroupComponent,
  ],
  exports: [GroupFormComponent, HierarchiesCreateGroupComponent],
})
export class AccountHierarchiesPageModule {}
