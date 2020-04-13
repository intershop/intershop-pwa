import { NgModule } from '@angular/core';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { LazyCreateOrderTemplateComponent } from './basket/lazy-create-order-template/lazy-create-order-template.component';
import { LazyProductAddToOrderTemplateComponent } from './products/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';

@NgModule({
  imports: [
    FeatureToggleModule,
    ReactiveComponentLoaderModule.withModule({
      moduleId: 'ish-extensions-order-templates',
      loadChildren: '../order-templates.module#OrderTemplatesModule',
    }),
  ],
  declarations: [LazyCreateOrderTemplateComponent, LazyProductAddToOrderTemplateComponent],
  exports: [LazyCreateOrderTemplateComponent, LazyProductAddToOrderTemplateComponent],
})
export class OrderTemplatesExportsModule {}
