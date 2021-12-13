import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyRecentlyViewedComponent } from './lazy-recently-viewed/lazy-recently-viewed.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'recently',
        location: () => import('../store/recently-store.module').then(m => m.RecentlyStoreModule),
      },
      multi: true,
    },
  ],
  declarations: [LazyRecentlyViewedComponent],
  exports: [LazyRecentlyViewedComponent],
})
export class RecentlyExportsModule {}
