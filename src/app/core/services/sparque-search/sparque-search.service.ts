import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SearchParameter, SearchResponse } from 'ish-core/models/search/search.model';
import { SparqueSearchResponse } from 'ish-core/models/sparque-search/sparque-search.interface';
import { SparqueSearchMapper } from 'ish-core/models/sparque-search/sparque-search.mapper';
import { SearchService } from 'ish-core/services/search/search.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export class SparqueSearchService extends SearchService {
  constructor(private sparqueApiService: SparqueApiService, private sparqueSearchMapper: SparqueSearchMapper) {
    super();
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
