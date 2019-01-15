import { NgModule } from '@angular/core';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';
import { ProductRoutePipe } from './pipes/product-route.pipe';

@NgModule({
  declarations: [AttributeToStringPipe, PricePipe, ProductRoutePipe],
  exports: [AttributeToStringPipe, PricePipe, ProductRoutePipe],
})
export class PipesModule {}
