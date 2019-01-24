import { NgModule } from '@angular/core';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';
import { DatePipe } from './pipes/date.pipe';
import { ProductRoutePipe } from './pipes/product-route.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';

@NgModule({
  declarations: [AttributeToStringPipe, DatePipe, PricePipe, ProductRoutePipe, SanitizePipe],
  exports: [AttributeToStringPipe, DatePipe, PricePipe, ProductRoutePipe, SanitizePipe],
})
export class PipesModule {}
