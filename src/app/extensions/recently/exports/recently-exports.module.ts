import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyRecentlyViewedComponent } from './lazy-recently-viewed/lazy-recently-viewed.component';

@NgModule({
  declarations: [LazyRecentlyViewedComponent],
  imports: [FeatureToggleModule],
  exports: [LazyRecentlyViewedComponent],
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
})
export class RecentlyExportsModule {}
