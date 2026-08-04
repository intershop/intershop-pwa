import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductGeoComponent } from './shared/product-geo/product-geo.component';

@NgModule({
  declarations: [ProductGeoComponent],
  imports: [SharedModule],
  exports: [ProductGeoComponent],
})
export class GeoModule {}
