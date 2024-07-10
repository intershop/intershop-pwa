import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { OrganizationHierarchiesGroupNameComponent } from './shared/organization-hierarchies-group-name/organization-hierarchies-group-name.component';
import { OrganizationHierarchiesPathComponent } from './shared/organization-hierarchies-path/organization-hierarchies-path.component';
import { OrganizationHierarchiesSwitchComponent } from './shared/organization-hierarchies-switch/organization-hierarchies-switch.component';
import { OrganizationHierarchiesStoreModule } from './store/organization-hierarchies-store.module';

@NgModule({
  imports: [OrganizationHierarchiesStoreModule, SharedModule],
  declarations: [
    OrganizationHierarchiesGroupNameComponent,
    OrganizationHierarchiesPathComponent,
    OrganizationHierarchiesSwitchComponent,
  ],
  exports: [
    OrganizationHierarchiesGroupNameComponent,
    OrganizationHierarchiesPathComponent,
    OrganizationHierarchiesSwitchComponent,
  ],
})
export class OrganizationHierarchiesModule {}
