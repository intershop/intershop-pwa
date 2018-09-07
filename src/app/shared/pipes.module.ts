import { NgModule } from '@angular/core';

import { AttributeToStringPipe } from './pipes/attribute.pipe';
import { PricePipe } from './pipes/price.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [AttributeToStringPipe, PricePipe, SafeHtmlPipe],
  exports: [AttributeToStringPipe, PricePipe, SafeHtmlPipe],
})
export class PipesModule {}
