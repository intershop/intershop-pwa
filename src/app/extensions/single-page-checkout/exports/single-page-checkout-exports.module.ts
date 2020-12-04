import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  imports: [FeatureToggleModule],
  declarations:[],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'spCheckout', location: import('../store/sp-checkout-store.module') },
      multi: true
    },
  ],
})
export class SinglePageCheckoutExportsModule {}
