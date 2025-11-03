import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';
import { SparqueSuggestionsService } from 'ish-core/services/sparque-suggestions/sparque-suggestions.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

/**
 * Service provider that dynamically selects between different suggestion service implementations
 * based on feature toggles and configuration. This allows switching between the default ICM
 * suggestion service and the Sparque AI-powered suggestion service.
 */
@Injectable({ providedIn: 'root' })
export class SuggestionsServiceProvider {
  constructor(
    private suggestService: SuggestService,
    private sparqueSuggestionsService: SparqueSuggestionsService,
    private store: Store
  ) {}

  /**
   * Gets the appropriate suggestions service implementation based on current configuration.
   *
   * @returns An observable emitting either SparqueSuggestionsService or the default ICM suggest service.
   */
  get(): Observable<SuggestionsServiceInterface> {
    return this.store.pipe(
      select(getSparqueConfig),
      take(1),
      map(config => {
        if (this.isSparqueSuggestionsEnabled(config)) {
          return this.sparqueSuggestionsService;
        }
        return this.suggestService;
      })
    );
  }

  private isSparqueSuggestionsEnabled(config: SparqueConfig | undefined): boolean {
    return config && Array.isArray(config.features) && config.features.includes('suggestions');
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
