import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs';

import { ICMSuggestionService } from 'ish-core/services/icm-suggestion/icm-suggestion.service';
import { SparqueSuggestionService } from 'ish-core/services/sparque-suggestion/sparque-suggestion.service';
import { SuggestionService } from 'ish-core/services/suggestion/suggestion.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

/**
 * Service provider for suggestion services.
 * Determines which suggestion service to use based on the store configuration.
 */
@Injectable({ providedIn: 'root' })
export class SuggestionServiceProvider {
  /**
   * Constructs a new instance of the SuggestionServiceProvider.
   *
   * @param icmSuggestionService - The service for handling ICM suggestions.
   * @param sparqueSuggestionService - The service for handling Sparque suggestions.
   * @param store - The NgRx store for state management.
   */
  constructor(
    private icmSuggestionService: ICMSuggestionService,
    private sparqueSuggestionService: SparqueSuggestionService,
    private store: Store
  ) {}

  /**
   * Gets the appropriate suggestion service based on the store configuration.
   *
   * @returns An instance of either SparqueSuggestionService or ICMSuggestionService.
   */
  get(): SuggestionService {
    let isSparque = false;
    this.store
      .pipe(select(getSparqueConfig), take(1))
      .subscribe(state => (state ? (isSparque = true) : (isSparque = false)));
    return isSparque ? this.sparqueSuggestionService : this.icmSuggestionService;
  }

  /**
   * Checks if the Sparque suggestion service is active.
   *
   * @returns True if the Sparque suggestion service is active, false otherwise.
   */
  isSparqueSuggestActive(): boolean {
    return this.get() instanceof SparqueSuggestionService;
  }
}
