import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyBasketCreateOrderTemplateComponent } from './basket/lazy-basket-create-order-template/lazy-basket-create-order-template.component';
import { LazyProductAddToOrderTemplateComponent } from './product/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'orderTemplates', location: import('../store/order-templates-store.module') },
      multi: true,
    },
  ],
  declarations: [LazyBasketCreateOrderTemplateComponent, LazyProductAddToOrderTemplateComponent],
  exports: [LazyBasketCreateOrderTemplateComponent, LazyProductAddToOrderTemplateComponent],
})
export class OrderTemplatesExportsModule {}
