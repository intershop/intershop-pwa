import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';
import { SuggestionsServiceInterface } from 'ish-core/service-provider/suggestions.service-provider';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

/**
 * The Suggest Service handles the interaction with the 'suggest' REST API.
 */
@Injectable({ providedIn: 'root' })
export class SuggestService implements SuggestionsServiceInterface {
  constructor(private apiService: ApiService) {}

  /**
   * Returns a list of suggested search terms matching the given search term.
   *
   * @param searchTerm  The search term to get suggestions for.
   * @returns           Suggestions with keywords section containing the suggested search terms.
   */
  searchSuggestions(searchTerm: string): Observable<{ suggestions: Suggestions }> {
    const params = new HttpParams().set('SearchTerm', searchTerm);
    return this.apiService.get('suggest', { params }).pipe(
      unpackEnvelope<{ term: string }>(),
      map(suggestTerms => ({
        keywords: suggestTerms.map(term => ({
          keyword: term.term,
        })),
      })),
      map(suggestions => ({ suggestions }))
    );
  }
}
