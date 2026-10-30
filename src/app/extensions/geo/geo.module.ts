import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductGeoComponent } from './shared/product-geo/product-geo.component';

@NgModule({
  imports: [SharedModule],
  declarations: [ProductGeoComponent],
  exports: [SharedModule],
})
export class GeoModule {}
