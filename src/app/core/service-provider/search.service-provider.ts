import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, take } from 'rxjs';

import { SearchParameter, SearchResponse } from 'ish-core/models/search/search.model';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SparqueSearchService } from 'ish-core/services/sparque-search/sparque-search.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';
import { URLFormParams } from 'ish-core/utils/url-form-params';

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
}

/**
 * Service for handling search-related operations.
 * This abstract class provides methods for searching suggestions, products,
 * and filtered products. Implementations of this service should define the
 * behavior for these search functionalities.
 */
export interface SearchService {
  /**
   * Searches for products based on the provided search parameters.
   *
   * @param searchParams - The parameters to filter and search for products.
   * @returns An observable that emits the search response containing the products.
   */
  searchProducts(searchParams: SearchParameter): Observable<SearchResponse>;

  /**
   * Retrieves filtered products based on the provided search parameters.
   *
   * @param searchParameter - The URL-formatted parameters for filtering the products.
   * @param amount - The number of products to retrieve.
   * @param sortKey - (Optional) The key to sort the products by.
   * @param offset - (Optional) The offset for pagination.
   * @returns An observable that emits the filtered search response.
   */
  getFilteredProducts(
    searchParameter: URLFormParams,
    amount: number,
    sortKey?: string,
    offset?: number
  ): Observable<SearchResponse>;

  getCategoryProducts(
    categoryUniqueId: string,
    amount: number,
    sortKey?: string,
    offset?: number
  ): Observable<SearchResponse>;
}
