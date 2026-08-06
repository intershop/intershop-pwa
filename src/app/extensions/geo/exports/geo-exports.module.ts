import { NgModule } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyProductGeoComponent } from './lazy-product-geo/lazy-product-geo.component';

@NgModule({
  declarations: [LazyProductGeoComponent],
  exports: [LazyProductGeoComponent],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'always',
        location: () => import('../store/geo-store.module').then(m => m.GeoStoreModule),
      },
      multi: true,
    },
  ],
})
export class GeoExportsModule {}
