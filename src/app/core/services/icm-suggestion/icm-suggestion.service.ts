import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { SuggestionService } from 'ish-core/services/suggestion/suggestion.service';

// not-dead-code
/**
 * The Suggest Service handles the interaction with the 'suggest' REST API.
 */
@Injectable({ providedIn: 'root' })
export class ICMSuggestionService extends SuggestionService {
  constructor(private apiService: ApiService) {
    super();
  }

  /**
   * Returns a list of suggested search terms matching the given search term.
   *
   * @param searchTerm  The search term to get suggestions for.
   * @returns           List of suggested search terms.
   */
  search(searchTerm: string): Observable<Suggestion> {
    const params = new HttpParams().set('SearchTerm', searchTerm);
    return this.apiService.get('suggest', { params }).pipe(
      unpackEnvelope<{ term: string }>(),
      map(suggestTerms => ({
        keywordSuggestions: suggestTerms.map(term => term.term),
      }))
    );
  }
}
