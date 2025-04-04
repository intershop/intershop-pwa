import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class SparqueSearchService extends SearchService {
  constructor(
    private sparqueApiService: SparqueApiService,
    private sparqueSuggestionMapper: SparqueSuggestionMapper,
    private sparqueSearchMapper: SparqueSearchMapper
  ) {
    super();
  }

  /**
   * Searches for suggestions based on the provided search term.
   *
   * @param searchTerm - The term to search for suggestions.
   * @returns An Observable emitting the search suggestions.
   */
  search(searchTerm: string): Observable<Suggestion> {
    // count: maximum number of suggestions which is used individually for each type of suggestion
    const params = new HttpParams().set('Keyword', searchTerm).set('count', '8');
    return this.sparqueApiService
      .get<SparqueSuggestions>(`suggestions`, { params, skipApiErrorHandling: true })
      .pipe(map(suggestions => this.sparqueSuggestionMapper.fromData(suggestions)));
  }

  searchProducts(searchParams: SearchParameter): Observable<SearchResponse> {
    let params = new HttpParams()
      .set('count', searchParams.amount.toString())
      .set('offset', searchParams.offset.toString())
      .set('facetOptionsCount', 5);
    if (searchParams.sorting) {
      params = params.set('sorting', searchParams.sorting);
    }
    if (!searchParams.searchParameter && searchParams.searchTerm) {
      params = params.set('keyword', searchParams.searchTerm);
    }

    return this.sparqueApiService
      .get<SparqueSearchResponse>(`search`, { params, skipApiErrorHandling: true })
      .pipe(map(result => this.sparqueSearchMapper.fromData(result, { searchTerm: [searchParams.searchTerm] })));
  }

  getFilteredProducts(
    searchParameter: URLFormParams,
    amount: number,
    sortKey?: string,
    offset = 0
  ): Observable<SearchResponse> {
    let params = new HttpParams()
      .set('count', amount ? amount.toString() : '')
      .set('offset', offset.toString())
      .set('facetOptionsCount', 5)
      .set('keyword', searchParameter.searchTerm ? searchParameter.searchTerm[0] : '');
    if (sortKey) {
      params = params.set('sorting', sortKey);
    }
    params = params.append('selectedFacets', selectedFacets(omit(searchParameter, 'searchTerm')));

    return this.sparqueApiService
      .get<SparqueSearchResponse>(`search`, { params, skipApiErrorHandling: true })
      .pipe(map(result => this.sparqueSearchMapper.fromData(result, searchParameter)));
  }
}

function selectedFacets(object: URLFormParams): string {
  let params = '';
  Object.entries(object).forEach(([key, val]) => {
    params = params + key.concat('|').concat(val[0]).concat(',');
  });
  return params.substring(0, params.length - 1);
}
