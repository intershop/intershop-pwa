import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueSuggestions } from 'ish-core/models/sparque-suggestions/sparque-suggestions.interface';
import { SparqueSuggestionsMapper } from 'ish-core/models/sparque-suggestions/sparque-suggestions.mapper';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';
import { SuggestionsServiceInterface } from 'ish-core/service-provider/suggestions.service-provider';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

/**
 * Service for interacting with the Sparque API to perform search suggestions related operations.
 * Extends the base `SuggestionsService` to provide specific implementations for Sparque.
 */
@Injectable({ providedIn: 'root' })
export class SparqueSuggestionsService implements SuggestionsServiceInterface {
  // API version for Sparque API.
  private readonly apiVersion = 'v2';
  // Maximum number of suggestions to request from the Sparque API.
  private readonly maxNumberOfRequestedSuggestions = '8';

  constructor(
    private sparqueApiService: SparqueApiService,
    private sparqueSuggestionsMapper: SparqueSuggestionsMapper
  ) {}

  /**
   * Retrieves search suggestions based on the provided search term.
   *
   * @param searchTerm - The term to search for suggestions.
   * @returns An observable emitting the mapped search suggestions.
   */
  searchSuggestions(
    searchTerm: string
  ): Observable<{ suggestions: Suggestions; categories?: CategoryTree; products?: Partial<Product>[] }> {
    const params = new HttpParams().set('Keyword', searchTerm).set('count', this.maxNumberOfRequestedSuggestions);

    return this.sparqueApiService
      .get<SparqueSuggestions>(`suggestions`, this.apiVersion, { params, skipApiErrorHandling: true })
      .pipe(map(suggestions => this.sparqueSuggestionsMapper.fromData(suggestions)));
  }
}
