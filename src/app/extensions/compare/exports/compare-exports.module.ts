import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyProductAddToCompareComponent } from './lazy-product-add-to-compare/lazy-product-add-to-compare.component';
import { LazyProductCompareStatusComponent } from './lazy-product-compare-status/lazy-product-compare-status.component';
import { LazyProductSendToCompareComponent } from './lazy-product-send-to-compare/lazy-product-send-to-compare.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('compare', true, {
      location: () => import('../store/compare-store.module').then(m => m.CompareStoreModule),
    }),
  ],
  declarations: [
    LazyProductAddToCompareComponent,
    LazyProductCompareStatusComponent,
    LazyProductSendToCompareComponent,
  ],
  exports: [LazyProductAddToCompareComponent, LazyProductCompareStatusComponent, LazyProductSendToCompareComponent],
})
export class CompareExportsModule {}
