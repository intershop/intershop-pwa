import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SearchParameter, SearchResponse } from 'ish-core/models/search/search.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export abstract class SearchService {
  abstract searchProducts(searchParams: SearchParameter): Observable<SearchResponse>;
  abstract getFilteredProducts(
    searchParameter: URLFormParams,
    amount: number,
    sortKey?: string,
    offset?: number
  ): Observable<SearchResponse>;
}
