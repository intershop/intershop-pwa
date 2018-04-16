import { NgModule } from '@angular/core';
import { AttributeToStringPipe } from './pipes/attribute.pipe';
import { PricePipe } from './pipes/price.pipe';

@NgModule({
  declarations: [AttributeToStringPipe, PricePipe],
  exports: [AttributeToStringPipe, PricePipe],
})
export class PipesModule {}
