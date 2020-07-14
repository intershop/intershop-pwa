import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyCompanySwitchComponent } from './structure/lazy-company-switch/lazy-company-switch.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'companyStructure', location: import('../store/company-structure-store.module') },
      multi: true,
    },
  ],
  declarations: [LazyCompanySwitchComponent],
  exports: [LazyCompanySwitchComponent],
})
export class CompanyStructureExportsModule {}
