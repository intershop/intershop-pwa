import { NgModule } from '@angular/core';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { QuotingRoutingModule } from '../pages/quoting-routing.module';

import { LazyBasketAddToQuoteComponent } from './basket/components/lazy-basket-add-to-quote/lazy-basket-add-to-quote.component';
import { LazyProductAddToQuoteComponent } from './product/components/lazy-product-add-to-quote/lazy-product-add-to-quote.component';

@NgModule({
  imports: [
    FeatureToggleModule,
    QuotingRoutingModule,
    ReactiveComponentLoaderModule.withModule({
      moduleId: 'ish-extensions-quoting',
      loadChildren: '../quoting.module#QuotingModule',
    }),
  ],
  declarations: [LazyBasketAddToQuoteComponent, LazyProductAddToQuoteComponent],
  exports: [LazyBasketAddToQuoteComponent, LazyProductAddToQuoteComponent],
})
export class QuotingExportsModule {}
