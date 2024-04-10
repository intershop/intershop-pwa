import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { GroupFormComponent } from './shared/component/group-form/group-form.component';
import { HierarchyGroupNameComponent } from './shared/hierarchy-group-name/hierarchy-group-name.component';
import { HierarchyOrderListComponent } from './shared/hierarchy-order-list/hierarchy-order-list.component';
import { HierarchyPathComponent } from './shared/hierarchy-path/hierarchy-path.component';
import { HierarchySwitchComponent } from './shared/hierarchy-switch/hierarchy-switch.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    GroupFormComponent,
    HierarchyGroupNameComponent,
    HierarchyOrderListComponent,
    HierarchyPathComponent,
    HierarchySwitchComponent,
  ],
  exports: [
    GroupFormComponent,
    HierarchyGroupNameComponent,
    HierarchyOrderListComponent,
    HierarchyPathComponent,
    HierarchySwitchComponent,
    SharedModule,
  ],
})
export class OrganizationHierarchiesModule {}
