import { ModuleWithProviders, NgModule } from '@angular/core';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';
import { DatePipe } from './pipes/date.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { MakeHrefPipe } from './pipes/make-href.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { CategoryRoutePipe } from './routing/category/category-route.pipe';
import { ProductRoutePipe } from './routing/product/product-route.pipe';

const pipes = [
  AttributeToStringPipe,
  CategoryRoutePipe,
  DatePipe,
  HighlightPipe,
  MakeHrefPipe,
  PricePipe,
  ProductRoutePipe,
  SafeHtmlPipe,
  SanitizePipe,
];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
})
export class PipesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PipesModule,
      providers: [...pipes],
    };
  }
}
