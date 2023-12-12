import { NgModule, inject } from '@angular/core';

import { CategoriesService, ICMCategoriesService } from './services/categories/categories.service';
import { FilterService, ICMFilterService } from './services/filter/filter.service';
import { ICMProductsService, ProductsService } from './services/products/products.service';
import { ICMSuggestService, SuggestService } from './services/suggest/suggest.service';

@NgModule({
  providers: [
    {
      provide: ProductsService,
      useFactory: () => inject(ICMProductsService),
    },
    {
      provide: SuggestService,
      useFactory: () => inject(ICMSuggestService),
    },
    {
      provide: FilterService,
      useFactory: () => inject(ICMFilterService),
    },
    {
      provide: CategoriesService,
      useFactory: () => inject(ICMCategoriesService),
    },
  ],
})
export class ServicesModule {}
