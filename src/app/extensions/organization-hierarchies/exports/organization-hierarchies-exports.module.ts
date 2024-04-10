/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { OrganizationHierarchiesInterceptor } from '../interceptors/organization-hierarchies.interceptor';

import { LazyHierarchyGroupNameComponent } from './lazy-hierarchy-group-name/lazy-hierarchy-group-name.component';
import { LazyHierarchyPathComponent } from './lazy-hierarchy-path/lazy-hierarchy-path.component';
import { LazyHierarchySwitchComponent } from './lazy-hierarchy-switch/lazy-hierarchy-switch.component';

@NgModule({
  imports: [CommonModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: OrganizationHierarchiesInterceptor, multi: true }],
  declarations: [LazyHierarchyGroupNameComponent, LazyHierarchyPathComponent, LazyHierarchySwitchComponent],
  exports: [LazyHierarchyGroupNameComponent, LazyHierarchyPathComponent, LazyHierarchySwitchComponent],
})
export class OrganizationHierarchiesExportsModule {}
