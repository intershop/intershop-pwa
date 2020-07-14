import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyHierarchySwitchComponent } from './lazy-hierarchy-switch/lazy-hierarchy-switch.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'organizationHierarchies',
        location: import('../store/organization-hierarchies-store.module'),
      },
      multi: true,
    },
  ],
  declarations: [LazyHierarchySwitchComponent],
  exports: [LazyHierarchySwitchComponent],
})
export class OrganizationHierarchiesExportsModule {}
