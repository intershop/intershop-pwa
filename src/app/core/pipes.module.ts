import { NgModule } from '@angular/core';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';
import { DatePipe } from './pipes/date.pipe';
import { FeatureTogglePipe } from './pipes/feature-toggle.pipe';
import { FrequencyPipe } from './pipes/frequency.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { HtmlEncodePipe } from './pipes/html-encode.pipe';
import { MakeHrefPipe } from './pipes/make-href.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { ServerSettingPipe } from './pipes/server-setting.pipe';
import { VariationAttributePipe } from './pipes/variation-attribute.pipe';
import { CategoryRoutePipe } from './routing/category/category-route.pipe';
import { ContentPageRoutePipe } from './routing/content-page/content-page-route.pipe';
import { ProductRoutePipe } from './routing/product/product-route.pipe';

const pipes = [
  AttributeToStringPipe,
  CategoryRoutePipe,
  ContentPageRoutePipe,
  DatePipe,
  FeatureTogglePipe,
  FrequencyPipe,
  HighlightPipe,
  HtmlEncodePipe,
  MakeHrefPipe,
  PricePipe,
  ProductRoutePipe,
  SanitizePipe,
  ServerSettingPipe,
  VariationAttributePipe,
];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
})
export class PipesModule {}
