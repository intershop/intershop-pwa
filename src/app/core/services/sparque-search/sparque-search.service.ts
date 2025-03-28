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
      searchParams.searchParameter = { searchTerm: [searchParams.searchTerm] };
    }
    params = appendFormParamsToHttpParams(searchParams.searchParameter, params);
    return this.sparqueApiService
      .get<SparqueSearchResponse>(`search`, { params, skipApiErrorHandling: true })
      .pipe(map(result => this.sparqueSearchMapper.fromData(result, searchParams.searchParameter)));
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
      .set('facetOptionsCount', 5);
    if (sortKey) {
      params = params.set('sorting', sortKey);
    }
    params = appendFormParamsToHttpParams(searchParameter, params);

    return this.sparqueApiService
      .get<SparqueSearchResponse>(`search`, { params, skipApiErrorHandling: true })
      .pipe(map(result => this.sparqueSearchMapper.fromData(result, searchParameter)));
  }
}

function appendFormParamsToHttpParams(
  object: URLFormParams,
  params: HttpParams = new HttpParams(),
  separator = ','
): HttpParams {
  return object
    ? Object.entries(object)
        .filter(([, value]) => Array.isArray(value) && value.length)
        .reduce((p, [key, val]) => {
          if (key.includes('searchTerm')) {
            return p.set('keyword', val.join(separator));
          }
          if (p.get('SelectedFacets')) {
            return p.set(
              'SelectedFacets',
              p.get('SelectedFacets').concat('&').concat(key).concat('|').concat(val.join(separator))
            );
          }
          return p.set('SelectedFacets', key.concat('|').concat(val.join(separator)));
        }, params)
    : params;
}
