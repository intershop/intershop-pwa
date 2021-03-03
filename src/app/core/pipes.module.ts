import { NgModule } from '@angular/core';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';
import { DatePipe } from './pipes/date.pipe';
import { FeatureTogglePipe } from './pipes/feature-toggle.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { MakeHrefPipe } from './pipes/make-href.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { ServerSettingPipe } from './pipes/server-setting.pipe';
import { CategoryRoutePipe } from './routing/category/category-route.pipe';
import { ProductRoutePipe } from './routing/product/product-route.pipe';

const pipes = [
  AttributeToStringPipe,
  CategoryRoutePipe,
  DatePipe,
  FeatureTogglePipe,
  HighlightPipe,
  MakeHrefPipe,
  PricePipe,
  ProductRoutePipe,
  SanitizePipe,
  ServerSettingPipe,
];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
})
export class PipesModule {}
