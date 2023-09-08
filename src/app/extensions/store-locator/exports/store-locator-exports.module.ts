import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyStoreLocatorFooterComponent } from './lazy-store-locator-footer/lazy-store-locator-footer.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('storeLocator', true, {
      location: () => import('../store/store-locator-store.module').then(m => m.StoreLocatorStoreModule),
    }),
  ],
  declarations: [LazyStoreLocatorFooterComponent],
  exports: [LazyStoreLocatorFooterComponent],
})
export class StoreLocatorExportsModule {}
