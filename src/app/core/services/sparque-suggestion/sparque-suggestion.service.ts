import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SparqueSuggestions } from 'ish-core/models/sparque-suggestion/sparque-suggestion.interface';
import { SparqueSuggestionMapper } from 'ish-core/models/sparque-suggestion/sparque-suggestion.mapper';
import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';
import { SuggestionService } from 'ish-core/services/suggestion/suggestion.service';

// not-dead-code
/**
 * Service to fetch suggested search terms from the Sparque Wrapper API.
 * Implements the SuggestService interface.
 */
@Injectable({ providedIn: 'root' })
export class SparqueSuggestionService extends SuggestionService {
  constructor(private sparqueApiService: SparqueApiService, private sparqueSuggestionMapper: SparqueSuggestionMapper) {
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
}
