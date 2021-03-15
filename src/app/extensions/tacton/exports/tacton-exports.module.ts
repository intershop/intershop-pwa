import { NgModule } from '@angular/core';

import { EXTERNAL_DISPLAY_PROPERTY_PROVIDER } from 'ish-core/facades/product-context.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { TactonProductContextDisplayPropertiesService } from '../services/tacton-product-context-display-properties/tacton-product-context-display-properties.service';

import { LazyTactonConfigureProductComponent } from './lazy-tacton-configure-product/lazy-tacton-configure-product.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'tacton',
        location: () => import('../store/tacton-store.module').then(m => m.TactonStoreModule),
      },
      multi: true,
    },
    {
      provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER,
      useClass: TactonProductContextDisplayPropertiesService,
      multi: true,
    },
  ],
  declarations: [LazyTactonConfigureProductComponent],
  exports: [LazyTactonConfigureProductComponent],
})
export class TactonExportsModule {}
