import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { HierarchySwitchComponent } from './shared/hierarchy-switch/hierarchy-switch.component';

@NgModule({
  imports: [SharedModule],
  declarations: [HierarchySwitchComponent],
  exports: [HierarchySwitchComponent, SharedModule],
})
export class OrganizationHierarchiesModule {}
