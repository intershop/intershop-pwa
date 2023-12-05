import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { HierarchyGroupNameComponent } from './shared/hierarchy-group-name/hierarchy-group-name.component';
import { HierarchyOrderListComponent } from './shared/hierarchy-order-list/hierarchy-order-list.component';
import { HierarchyPathComponent } from './shared/hierarchy-path/hierarchy-path.component';
import { HierarchySwitchComponent } from './shared/hierarchy-switch/hierarchy-switch.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    HierarchyGroupNameComponent,
    HierarchyOrderListComponent,
    HierarchyPathComponent,
    HierarchySwitchComponent,
  ],
  exports: [
    HierarchyGroupNameComponent,
    HierarchyOrderListComponent,
    HierarchyPathComponent,
    HierarchySwitchComponent,
    SharedModule,
  ],
})
export class OrganizationHierarchiesModule {}
