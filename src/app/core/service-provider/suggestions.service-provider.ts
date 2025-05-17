import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, take } from 'rxjs';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Product } from 'ish-core/models/product/product.model';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';
import { SparqueSuggestionsService } from 'ish-core/services/sparque-suggestions/sparque-suggestions.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

@Injectable({ providedIn: 'root' })
export class SuggestionsServiceProvider {
  constructor(
    private suggestService: SuggestService,
    private sparqueSuggestionsService: SparqueSuggestionsService,
    private store: Store
  ) {}

  /**
   * Gets the appropriate suggestions service based on the store configuration.
   *
   * @returns An instance of either SparqueSuggestionsService or SuggestService (ICM/Solr).
   */
  get(): SuggestionsServiceInterface {
    let isSparque = false;
    this.store
      .pipe(select(getSparqueConfig), take(1))
      .subscribe(sparqueConfig => (sparqueConfig ? (isSparque = true) : (isSparque = false)));
    return isSparque ? this.sparqueSuggestionsService : this.suggestService;
  }
}

/**
 * Abstract service class that defines methods for search suggestions.
 * Implementations of this service should define the behavior for these suggestions functionalities.
 */
export interface SuggestionsServiceInterface {
  /**
   * Searches for suggestions based on the provided search term.
   *
   * @param searchTerm - The term to search for suggestions.
   * @returns An observable that emits the search suggestions.
   */
  searchSuggestions(
    searchTerm: string
  ): Observable<{ suggestions: Suggestions; categories?: CategoryTree; products?: Partial<Product>[] }>;
}
