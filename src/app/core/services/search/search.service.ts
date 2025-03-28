import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SearchParameter, SearchResponse } from 'ish-core/models/search/search.model';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Injectable({ providedIn: 'root' })
export abstract class SearchService {
  /**
   * Searches for suggestions based on the provided search term.
   *
   * @param searchTerm - The term to search for suggestions.
   * @returns An observable that emits the search results.
   */
  abstract search(searchTerm: string): Observable<Suggestion>;
  abstract searchProducts(searchParams: SearchParameter): Observable<SearchResponse>;
  abstract getFilteredProducts(
    searchParameter: URLFormParams,
    amount: number,
    sortKey?: string,
    offset?: number
  ): Observable<SearchResponse>;
}
