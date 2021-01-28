import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { HierarchyGroupNameComponent } from './shared/hierarchy-group-name/hierarchy-group-name.component';
import { HierarchySwitchComponent } from './shared/hierarchy-switch/hierarchy-switch.component';

@NgModule({
  imports: [SharedModule],
  declarations: [HierarchyGroupNameComponent, HierarchySwitchComponent],
  exports: [HierarchyGroupNameComponent, HierarchySwitchComponent, SharedModule],
})
export class OrganizationHierarchiesModule {}
