import { NgModule } from '@angular/core';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';
import { DatePipe } from './pipes/date.pipe';
import { MakeHrefPipe } from './pipes/make-href.pipe';
import { ProductRoutePipe } from './pipes/product-route.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';

@NgModule({
  declarations: [
    AttributeToStringPipe,
    DatePipe,
    MakeHrefPipe,
    PricePipe,
    ProductRoutePipe,
    SafeHtmlPipe,
    SanitizePipe,
  ],
  exports: [AttributeToStringPipe, DatePipe, MakeHrefPipe, PricePipe, ProductRoutePipe, SafeHtmlPipe, SanitizePipe],
})
export class PipesModule {}
