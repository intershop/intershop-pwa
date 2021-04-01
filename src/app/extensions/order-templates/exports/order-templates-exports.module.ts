import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyBasketCreateOrderTemplateComponent } from './lazy-basket-create-order-template/lazy-basket-create-order-template.component';
import { LazyOrderTemplateWidgetComponent } from './lazy-order-template-widget/lazy-order-template-widget.component';
import { LazyProductAddToOrderTemplateComponent } from './lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'orderTemplates',
        location: () => import('../store/order-templates-store.module').then(m => m.OrderTemplatesStoreModule),
      },
      multi: true,
    },
  ],
  declarations: [
    LazyBasketCreateOrderTemplateComponent,
    LazyOrderTemplateWidgetComponent,
    LazyProductAddToOrderTemplateComponent,
  ],
  exports: [
    LazyBasketCreateOrderTemplateComponent,
    LazyOrderTemplateWidgetComponent,
    LazyProductAddToOrderTemplateComponent,
  ],
})
export class OrderTemplatesExportsModule {}
