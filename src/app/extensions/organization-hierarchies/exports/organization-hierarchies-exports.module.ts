/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BuyingContextInterceptor } from '../interceptors/buying-context.interceptor';
import { OrganizationHierarchiesRedirectInterceptor } from '../interceptors/organization-hierarchies-redirect.interceptor';

import { LazyHierarchyGroupNameComponent } from './lazy-hierarchy-group-name/lazy-hierarchy-group-name.component';
import { LazyHierarchyPathComponent } from './lazy-hierarchy-path/lazy-hierarchy-path.component';
import { LazyHierarchySwitchComponent } from './lazy-hierarchy-switch/lazy-hierarchy-switch.component';

@NgModule({
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: OrganizationHierarchiesRedirectInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BuyingContextInterceptor, multi: true },
  ],
  declarations: [LazyHierarchyGroupNameComponent, LazyHierarchyPathComponent, LazyHierarchySwitchComponent],
  exports: [LazyHierarchyGroupNameComponent, LazyHierarchyPathComponent, LazyHierarchySwitchComponent],
})
export class OrganizationHierarchiesExportsModule {}
