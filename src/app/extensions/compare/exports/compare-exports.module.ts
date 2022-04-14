import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyProductAddToCompareComponent } from './lazy-product-add-to-compare/lazy-product-add-to-compare.component';
import { LazyProductCompareStatusComponent } from './lazy-product-compare-status/lazy-product-compare-status.component';
import { LazyProductSendToCompareComponent } from './lazy-product-send-to-compare/lazy-product-send-to-compare.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'compare',
        location: () => import('../store/compare-store.module').then(m => m.CompareStoreModule),
      },
      multi: true,
    },
  ],
  declarations: [
    LazyProductAddToCompareComponent,
    LazyProductCompareStatusComponent,
    LazyProductSendToCompareComponent,
  ],
  exports: [LazyProductAddToCompareComponent, LazyProductCompareStatusComponent, LazyProductSendToCompareComponent],
})
export class CompareExportsModule {}
