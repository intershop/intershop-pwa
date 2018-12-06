import { NgModule } from '@angular/core';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';

@NgModule({
  declarations: [AttributeToStringPipe, PricePipe],
  exports: [AttributeToStringPipe, PricePipe],
})
export class PipesModule {}
