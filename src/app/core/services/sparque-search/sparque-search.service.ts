import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';

import { SearchParameter, SearchResponse } from 'ish-core/models/search/search.model';
import { SparqueSearchResponse } from 'ish-core/models/sparque-search/sparque-search.interface';
import { SparqueSearchMapper } from 'ish-core/models/sparque-search/sparque-search.mapper';
import { SparqueSuggestions } from 'ish-core/models/sparque-suggestion/sparque-suggestion.interface';
import { SparqueSuggestionMapper } from 'ish-core/models/sparque-suggestion/sparque-suggestion.mapper';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { SearchService } from 'ish-core/services/search/search.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';
import { omit } from 'ish-core/utils/functions';
import { URLFormParams } from 'ish-core/utils/url-form-params';

/**
 * Service for interacting with the Sparque API to perform search-related operations.
 * Extends the base `SearchService` to provide specific implementations for Sparque.
 */
@Injectable({ providedIn: 'root' })
export class SparqueSearchService extends SearchService {
  // API version for Sparque API.
  private readonly apiVersion = 'v2';
  // Maximum number of suggestions to request from the Sparque API.
  private readonly maxNumberOfRequestedSuggestions = '8';
  // Maximum number of facet options to request from the Sparque API.
  private readonly facetOptionsCount = '10';

  /**
   * Constructs the SparqueSearchService.
   *
   * @param sparqueApiService - Service for making API calls to the Sparque backend.
   * @param sparqueSuggestionMapper - Mapper for transforming Sparque suggestion data.
   * @param sparqueSearchMapper - Mapper for transforming Sparque search response data.
   */
  constructor(
    private sparqueApiService: SparqueApiService,
    private sparqueSuggestionMapper: SparqueSuggestionMapper,
    private sparqueSearchMapper: SparqueSearchMapper
  ) {
    super();
  }

  /**
   * Retrieves search suggestions based on the provided search term.
   *
   * @param searchTerm - The term to search for suggestions.
   * @returns An observable emitting the mapped search suggestions.
   */
  searchSuggestions(searchTerm: string): Observable<Suggestion> {
    const params = new HttpParams().set('Keyword', searchTerm).set('count', this.maxNumberOfRequestedSuggestions);
    return this.sparqueApiService
      .get<SparqueSuggestions>(`suggestions`, this.apiVersion, { params, skipApiErrorHandling: true })
      .pipe(map(suggestions => this.sparqueSuggestionMapper.fromData(suggestions)));
  }

  /**
   * Searches for products based on the provided search parameters.
   *
   * @param searchParams - The parameters for the product search, including term, amount, offset, and sorting.
   * @returns An observable emitting the mapped search response.
   */
  searchProducts(searchParams: SearchParameter): Observable<SearchResponse> {
    let params = new HttpParams()
      .set('count', searchParams.amount.toString())
      .set('offset', searchParams.offset.toString())
      .set('facetOptionsCount', this.facetOptionsCount);
    if (searchParams.sorting) {
      params = params.set('sorting', searchParams.sorting);
    }
    if (!searchParams.searchParameter && searchParams.searchTerm) {
      params = params.set('keyword', searchParams.searchTerm);
    }

    return this.sparqueApiService
      .get<SparqueSearchResponse>(`search`, this.apiVersion, { params, skipApiErrorHandling: true })
      .pipe(map(result => this.sparqueSearchMapper.fromData(result, { searchTerm: [searchParams.searchTerm] })));
  }

  /**
   * Retrieves filtered products based on the provided search parameters.
   *
   * @param searchParameter - The search parameters, including facets and search term.
   * @param amount - The number of products to retrieve.
   * @param sortKey - The key to sort the results by (optional).
   * @param offset - The offset for pagination (default is 0).
   * @returns An observable emitting the mapped search response.
   */
  getFilteredProducts(
    searchParameter: URLFormParams,
    amount: number,
    sortKey?: string,
    offset = 0
  ): Observable<SearchResponse> {
    let params = new HttpParams()
      .set('count', amount ? amount.toString() : '')
      .set('offset', offset.toString())
      .set('facetOptionsCount', this.facetOptionsCount)
      .set('keyword', searchParameter.searchTerm ? searchParameter.searchTerm[0] : '');
    if (sortKey) {
      params = params.set('sorting', sortKey);
    }
    params = params.append('selectedFacets', selectedFacets(omit(searchParameter, 'searchTerm')));

    return this.sparqueApiService
      .get<SparqueSearchResponse>(`search`, this.apiVersion, { params, skipApiErrorHandling: true })
      .pipe(map(result => this.sparqueSearchMapper.fromData(result, searchParameter)));
  }

  /**
   * Retrieves products for a specific category.
   *
   * @param categoryUniqueId - The unique identifier of the category.
   * @param amount - The number of products to retrieve.
   * @param sortKey - The key to sort the results by (optional).
   * @param offset - The offset for pagination (default is 0).
   * @returns An observable emitting the mapped search response.
   * @throws An error if the categoryUniqueId is not provided.
   */
  getCategoryProducts(
    categoryUniqueId: string,
    amount: number,
    sortKey?: string,
    offset = 0
  ): Observable<SearchResponse> {
    if (!categoryUniqueId) {
      return throwError(() => new Error('getCategoryProducts() called without categoryUniqueId'));
    }

    let params = new HttpParams()
      .set('amount', amount.toString())
      .set('offset', offset.toString())
      .set('categoryIds', categoryUniqueId.split('.')[1]);

    if (sortKey) {
      params = params.set('sorting', sortKey);
    }

    return this.sparqueApiService
      .get<SparqueSearchResponse>(`products`, this.apiVersion, { params })
      .pipe(map(result => this.sparqueSearchMapper.fromData(result, { ['category']: [categoryUniqueId] })));
  }
}

function selectedFacets(object: URLFormParams): string {
  let params = '';
  Object.entries(object).forEach(([key, val]) => {
    params = params + key.concat('|').concat(val[0]).concat(',');
  });
  return params.substring(0, params.length - 1);
}
