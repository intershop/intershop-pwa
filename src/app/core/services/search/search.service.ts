import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SearchParameter, SearchResponse } from 'ish-core/models/search/search.model';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

/**
 * Service for handling search-related operations.
 * This abstract class provides methods for searching suggestions, products,
 * and filtered products. Implementations of this service should define the
 * behavior for these search functionalities.
 */
@Injectable({ providedIn: 'root' })
export abstract class SearchService {
  /**
   * Searches for suggestions based on the provided search term.
   *
   * @param searchTerm - The term to search for suggestions.
   * @returns An observable that emits the search suggestions.
   */
  abstract searchSuggestions(searchTerm: string): Observable<Suggestion>;

  /**
   * Searches for products based on the provided search parameters.
   *
   * @param searchParams - The parameters to filter and search for products.
   * @returns An observable that emits the search response containing the products.
   */
  abstract searchProducts(searchParams: SearchParameter): Observable<SearchResponse>;

  /**
   * Retrieves filtered products based on the provided search parameters.
   *
   * @param searchParameter - The URL-formatted parameters for filtering the products.
   * @param amount - The number of products to retrieve.
   * @param sortKey - (Optional) The key to sort the products by.
   * @param offset - (Optional) The offset for pagination.
   * @returns An observable that emits the filtered search response.
   */
  abstract getFilteredProducts(
    searchParameter: URLFormParams,
    amount: number,
    sortKey?: string,
    offset?: number
  ): Observable<SearchResponse>;

  abstract getCategoryProducts(
    categoryUniqueId: string,
    amount: number,
    sortKey?: string,
    offset?: number
  ): Observable<SearchResponse>;
}
