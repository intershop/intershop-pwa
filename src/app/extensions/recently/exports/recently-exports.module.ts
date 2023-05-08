import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyRecentlyViewedComponent } from './lazy-recently-viewed/lazy-recently-viewed.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('recently', true, {
      location: () => import('../store/recently-store.module').then(m => m.RecentlyStoreModule),
    }),
  ],
  declarations: [LazyRecentlyViewedComponent],
  exports: [LazyRecentlyViewedComponent],
})
export class RecentlyExportsModule {}
