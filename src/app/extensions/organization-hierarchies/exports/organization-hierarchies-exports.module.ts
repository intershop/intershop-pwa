// tslint:disable-next-line: ish-ordered-imports
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

// tslint:disable-next-line: ban-specific-imports
import { TxSelectedGroupInterceptor } from '../interceptors/tx-selected-group.interceptor';

import { LazyHierarchyGroupNameComponent } from './lazy-hierarchy-group-name/lazy-hierarchy-group-name.component';
import { LazyHierarchySwitchComponent } from './lazy-hierarchy-switch/lazy-hierarchy-switch.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'organizationHierarchies',
        location: () =>
          import('../store/organization-hierarchies-store.module').then(m => m.OrganizationHierarchiesStoreModule),
      },
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TxSelectedGroupInterceptor, multi: true },
  ],

  declarations: [LazyHierarchyGroupNameComponent, LazyHierarchySwitchComponent],
  exports: [LazyHierarchyGroupNameComponent, LazyHierarchySwitchComponent],
})
export class OrganizationHierarchiesExportsModule {}
