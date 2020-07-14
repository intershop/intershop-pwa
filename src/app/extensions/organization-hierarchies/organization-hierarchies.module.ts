import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { HierarchySwitchComponent } from './shared/hierarchies/hierarchy-switch/hierarchy-switch.component';

@NgModule({
  imports: [SharedModule],
  declarations: [HierarchySwitchComponent],
  exports: [HierarchySwitchComponent, SharedModule],
})
export class OrganizationHierarchiesModule {}
