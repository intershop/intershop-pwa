import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs';

import { ProductsService } from 'ish-core/services/products/products.service';
import { SearchService } from 'ish-core/services/search/search.service';
import { SparqueSearchService } from 'ish-core/services/sparque-search/sparque-search.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

@Injectable({ providedIn: 'root' })
export class SearchServiceProvider {
  constructor(
    private productsService: ProductsService,
    private sparqueSearchService: SparqueSearchService,
    private store: Store
  ) {}

  /**
   * Gets the appropriate search service based on the store configuration.
   *
   * @returns An instance of either SparqueSearchService or ProductsService.
   */
  get(): SearchService {
    let isSparque = false;
    this.store
      .pipe(select(getSparqueConfig), take(1))
      .subscribe(sparqueConfig => (sparqueConfig ? (isSparque = true) : (isSparque = false)));
    return isSparque ? this.sparqueSearchService : this.productsService;
  }

  isSparqueSearchActive(): boolean {
    return this.get() instanceof SparqueSearchService;
  }
}
