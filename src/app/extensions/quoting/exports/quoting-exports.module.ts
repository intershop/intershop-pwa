import { NgModule } from '@angular/core';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyQuoteWidgetComponent } from './account/lazy-quote-widget/lazy-quote-widget.component';
import { LazyBasketAddToQuoteComponent } from './basket/lazy-basket-add-to-quote/lazy-basket-add-to-quote.component';
import { LazyProductAddToQuoteComponent } from './product/lazy-product-add-to-quote/lazy-product-add-to-quote.component';

@NgModule({
  imports: [
    FeatureToggleModule,
    ReactiveComponentLoaderModule.withModule({
      moduleId: 'ish-extensions-quoting',
      loadChildren: '../quoting.module#QuotingModule',
    }),
  ],
  declarations: [LazyBasketAddToQuoteComponent, LazyProductAddToQuoteComponent, LazyQuoteWidgetComponent],
  exports: [LazyBasketAddToQuoteComponent, LazyProductAddToQuoteComponent, LazyQuoteWidgetComponent],
})
export class QuotingExportsModule {}
