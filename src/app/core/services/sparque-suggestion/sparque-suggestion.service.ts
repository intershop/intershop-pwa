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
  constructor(private sparqueApiService: SparqueApiService) {
    super();
  }

  /**
   * Searches for suggestions based on the provided search term.
   *
   * @param searchTerm - The term to search for suggestions.
   * @returns An Observable emitting the search suggestions.
   */
  search(searchTerm: string): Observable<Suggestion> {
    const params = new HttpParams().set('Keyword', searchTerm);
    return this.sparqueApiService
      .get<SparqueSuggestions>(`suggestions`, { params })
      .pipe(map(SparqueSuggestionMapper.fromData));
  }
}
