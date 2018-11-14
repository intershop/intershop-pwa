import { NgModule } from '@angular/core';

import { SafeHtmlPipe } from '../content/pipes/safe-html.pipe';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';

@NgModule({
  declarations: [AttributeToStringPipe, PricePipe, SafeHtmlPipe],
  exports: [AttributeToStringPipe, PricePipe, SafeHtmlPipe],
})
export class PipesModule {}
