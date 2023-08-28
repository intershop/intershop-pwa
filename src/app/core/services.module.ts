import { NgModule, inject } from '@angular/core';

import { FeatureToggleService } from './feature-toggle.module';
import { CategoriesService, ICMCategoriesService } from './services/categories/categories.service';
import { FilterService, ICMFilterService } from './services/filter/filter.service';
import { ICMProductsService, ProductsService } from './services/products/products.service';
import { SparqueCategoriesService } from './services/sparque/sparque-categories/sparque-categories.service';
import { SparqueFilterService } from './services/sparque/sparque-filter/sparque-filter.service';
import { SparqueProductsService } from './services/sparque/sparque-products/sparque-products.service';
import { SparqueSuggestService } from './services/sparque/sparque-suggest/sparque-suggest.service';
import { ICMSuggestService, SuggestService } from './services/suggest/suggest.service';

@NgModule({
  providers: [
    {
      provide: ProductsService,
      useFactory: () =>
        inject(FeatureToggleService).enabled('sparque') ? inject(SparqueProductsService) : inject(ICMProductsService),
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
    {
      provide: CategoriesService,
      useFactory: () =>
        inject(FeatureToggleService).enabled('sparque')
          ? inject(SparqueCategoriesService)
          : inject(ICMCategoriesService),
    },
  ],
})
export class ServicesModule {}
