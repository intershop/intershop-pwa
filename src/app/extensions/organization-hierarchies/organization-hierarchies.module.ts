import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { HierarchyGroupNameComponent } from './shared/hierarchy-group-name/hierarchy-group-name.component';
import { HierarchyPathComponent } from './shared/hierarchy-path/hierarchy-path.component';
import { HierarchySwitchComponent } from './shared/hierarchy-switch/hierarchy-switch.component';

@NgModule({
  imports: [SharedModule],
  declarations: [HierarchyGroupNameComponent, HierarchyPathComponent, HierarchySwitchComponent],
  exports: [HierarchyGroupNameComponent, HierarchyPathComponent, HierarchySwitchComponent, SharedModule],
})
export class OrganizationHierarchiesModule {}
