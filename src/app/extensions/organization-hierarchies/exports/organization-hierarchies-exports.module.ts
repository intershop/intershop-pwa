/* eslint-disable ish-custom-rules/ban-imports-file-pattern */
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { OrganizationHierarchiesInterceptor } from '../interceptors/organization-hierarchies.interceptor';

import { LazyOrganizationHierarchiesGroupNameComponent } from './lazy-organization-hierarchies-group-name/lazy-organization-hierarchies-group-name.component';
import { LazyOrganizationHierarchiesPathComponent } from './lazy-organization-hierarchies-path/lazy-organization-hierarchies-path.component';
import { LazyOrganizationHierarchiesSwitchComponent } from './lazy-organization-hierarchies-switch/lazy-organization-hierarchies-switch.component';

@NgModule({
  imports: [CommonModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: OrganizationHierarchiesInterceptor, multi: true }],
  declarations: [
    LazyOrganizationHierarchiesGroupNameComponent,
    LazyOrganizationHierarchiesPathComponent,
    LazyOrganizationHierarchiesSwitchComponent,
  ],
  exports: [
    LazyOrganizationHierarchiesGroupNameComponent,
    LazyOrganizationHierarchiesPathComponent,
    LazyOrganizationHierarchiesSwitchComponent,
  ],
})
export class OrganizationHierarchiesExportsModule {}
