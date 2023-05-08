import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyBasketCreateOrderTemplateComponent } from './lazy-basket-create-order-template/lazy-basket-create-order-template.component';
import { LazyOrderTemplateWidgetComponent } from './lazy-order-template-widget/lazy-order-template-widget.component';
import { LazyProductAddToOrderTemplateComponent } from './lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('orderTemplates', true, {
      location: () => import('../store/order-templates-store.module').then(m => m.OrderTemplatesStoreModule),
    }),
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
