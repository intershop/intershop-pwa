import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyHeaderQuickorderComponent } from './header/lazy-header-quickorder/lazy-header-quickorder.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'quickorder', location: import('../quickorder.module') },
      multi: true,
    },
  ],
  declarations: [LazyHeaderQuickorderComponent],
  exports: [LazyHeaderQuickorderComponent],
})
export class QuickorderExportsModule {}
