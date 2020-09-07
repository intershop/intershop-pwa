import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyBasketAddToQuoteComponent } from './lazy-basket-add-to-quote/lazy-basket-add-to-quote.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'quoting2', location: import('../store/quoting2-store.module') },
      multi: true,
    },
  ],
  declarations: [LazyBasketAddToQuoteComponent],
  exports: [LazyBasketAddToQuoteComponent],
})
export class Quoting2ExportsModule {}
