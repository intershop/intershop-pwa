import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';

/**
 * Abstract service for providing search term suggestions.
 *
 * This service defines a contract for implementing search term suggestion functionality.
 * Implementations of this service should provide a method to return a list of suggested
 * search terms based on a given search term.
 */
@Injectable({ providedIn: 'root' })
export abstract class SuggestionService {
  /**
   * Searches for suggestions based on the provided search term.
   *
   * @param searchTerm - The term to search for suggestions.
   * @returns An observable that emits the search results.
   */
  abstract search(searchTerm: string): Observable<Suggestion>;
}
