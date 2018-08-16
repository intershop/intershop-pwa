import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ProductShipmentComponent } from '../shopping/components/product/product-shipment/product-shipment.component';

import { ProductImageComponent } from './product/components/product-image/product-image.component';
import { SharedModule } from './shared.module';

const sharedComponents = [ProductImageComponent, ProductShipmentComponent];

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule],
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class SharedProductModule {}
