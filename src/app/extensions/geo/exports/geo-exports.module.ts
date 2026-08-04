import { NgModule } from '@angular/core';

import { LazyProductGeoComponent } from './lazy-product-geo/lazy-product-geo.component';

@NgModule({
  declarations: [LazyProductGeoComponent],
  exports: [LazyProductGeoComponent],
})
export class GeoExportsModule {}
