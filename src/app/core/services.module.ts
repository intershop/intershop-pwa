import { NgModule, inject } from '@angular/core';

import { FeatureToggleService } from './feature-toggle.module';
import { FilterService, ICMFilterService } from './services/filter/filter.service';
import { ICMProductsService, ProductsService } from './services/products/products.service';
import { SparqueFilterService } from './services/sparque/sparque-filter/sparque-filter.service';
import { SparqueProductService } from './services/sparque/sparque-product/sparque-product.service';
import { SparqueSuggestService } from './services/sparque/sparque-suggest/sparque-suggest.service';
import { ICMSuggestService, SuggestService } from './services/suggest/suggest.service';

@NgModule({
  providers: [
    {
      provide: ProductsService,
      useFactory: () =>
        inject(FeatureToggleService).enabled('sparque') ? inject(SparqueProductService) : inject(ICMProductsService),
    },
    {
      provide: SuggestService,
      useFactory: () =>
        inject(FeatureToggleService).enabled('sparque') ? inject(SparqueSuggestService) : inject(ICMSuggestService),
    },
    {
      provide: FilterService,
      useFactory: () =>
        inject(FeatureToggleService).enabled('sparque') ? inject(SparqueFilterService) : inject(ICMFilterService),
    },
  ],
})
export class ServicesModule {}
