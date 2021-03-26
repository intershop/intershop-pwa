import { NgModule } from '@angular/core';

import { EXTERNAL_DISPLAY_PROPERTY_PROVIDER } from 'ish-core/facades/product-context.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyPunchoutTransferBasketComponent } from './lazy-punchout-transfer-basket/lazy-punchout-transfer-basket.component';
import { PunchoutProductContextDisplayPropertiesService } from './punchout-product-context-display-properties/punchout-product-context-display-properties.service';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'punchout',
        location: () => import('../store/punchout-store.module').then(m => m.PunchoutStoreModule),
      },
      multi: true,
    },
    {
      provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER,
      useClass: PunchoutProductContextDisplayPropertiesService,
      multi: true,
    },
  ],
  declarations: [LazyPunchoutTransferBasketComponent],
  exports: [LazyPunchoutTransferBasketComponent],
})
export class PunchoutExportsModule {}
