import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';

import { Product } from 'ish-core/models/product/product.model';
import { SearchParameter, SearchResponse } from 'ish-core/models/search/search.model';
import { SPARQUE_FEATURES, SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SparqueProductsService } from 'ish-core/services/sparque-products/sparque-products.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';
import { URLFormParams } from 'ish-core/utils/url-form-params';

/**
 * Service provider that determines which products service implementation to use
 * based on Sparque configuration and feature toggles.
 *
 * This provider acts as a factory that returns either the standard ProductsService
 * or the SparqueProductsService based on:
 * - Sparque configuration availability
 * - Feature toggle states (sparque_search)
 * - skipSparque parameter override
 *
 * The provider implements a legacy mode where any valid Sparque configuration
 * will enable Sparque functionality even without explicit feature toggles.
 */
@Injectable({ providedIn: 'root' })
export class ProductsServiceProvider {
  constructor(
    private productsService: ProductsService,
    private sparqueProductsService: SparqueProductsService,
    private store: Store
  ) {}

  /**
   * Gets the appropriate products service implementation based on configuration and parameters.
   *
  /**
   * Gets the appropriate products service implementation based on configuration and parameters.
   *
   * @returns An observable emitting either SparqueProductsService or ProductsService.
   */
  get(): Observable<ProductsServiceInterface> {
    return this.store.pipe(
      select(getSparqueConfig),
      take(1),
      map(sparqueConfig =>
        this.isSparqueSearchEnabled(sparqueConfig) ? this.sparqueProductsService : this.productsService
      )
    );
  }

  private isSparqueSearchEnabled(config: SparqueConfig | undefined): boolean {
    return config && Array.isArray(config.features) && config.features.includes(SPARQUE_FEATURES.SEARCH);
  }
}

/**
 * Service for handling search-related operations.
 * This abstract class provides methods for searching suggestions, products,
 * and filtered products. Implementations of this service should define the
 * behavior for these search functionalities.
 */
export interface ProductsServiceInterface {
  /**
   * Get the full Product data for the given Product SKU.
   *
   * @param sku  The Product SKU for the product of interest.
   * @returns    The Product data.
   */
  getProduct(sku: string): Observable<Partial<Product>>;

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

  /**
   * Retrieves products for a specific category.
   *
   * @param categoryUniqueId - The unique identifier of the category.
   * @param amount - The number of products to retrieve.
   * @param sortKey - (Optional) The key to sort the products by.
   * @param offset - (Optional) The offset for pagination.
   * @param selectedFacets - (Optional) The selected facets to filter by.
   * @returns An observable that emits the search response containing the products.
   */
  getCategoryProducts(
    categoryUniqueId: string,
    amount: number,
    sortKey?: string,
    offset?: number
  ): Observable<SearchResponse>;
}
