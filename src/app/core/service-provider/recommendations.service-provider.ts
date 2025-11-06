import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';

import { Product } from 'ish-core/models/product/product.model';
import { Recommendations, RecommendationsContext } from 'ish-core/models/recommendations/recommendations.model';
import { SPARQUE_FEATURES, SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';
import { SparqueRecommendationsService } from 'ish-core/services/sparque-recommendations/sparque-recommendations.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

/**
 * Service provider that dynamically selects the appropriate recommendation service implementation
 * based on feature toggles and configuration. Currently supports Sparque AI-powered recommendations
 * or returns undefined when recommendations are not available.
 */
@Injectable({ providedIn: 'root' })
export class RecommendationsServiceProvider {
  constructor(private sparqueRecommendationsService: SparqueRecommendationsService, private store: Store) {}

  /**
   * Gets the appropriate recommendations service implementation based on current configuration.
   *
   * @returns An observable emitting either SparqueRecommendationsService or, otherwise undefined.
   */
  get(): Observable<RecommendationsServiceInterface> {
    return this.store.pipe(
      select(getSparqueConfig),
      take(1),
      map(sparqueConfig =>
        this.isSparqueRecommendationsEnabled(sparqueConfig) ? this.sparqueRecommendationsService : undefined
      )
    );
  }

  private isSparqueRecommendationsEnabled(config: SparqueConfig | undefined): boolean {
    return config && Array.isArray(config.features) && config?.features?.includes(SPARQUE_FEATURES.RECOMMENDATIONS);
  }
}

/**
 * Abstract service interface that defines methods for product recommendations.
 * Implementations of this service should define the behavior for these recommendation functionalities.
 */
export interface RecommendationsServiceInterface {
  /**
   * Gets product recommendations based on the provided recommendation configuration.
   *
   * @param recommendationsContext - The recommendation context containing strategy and parameters.
   * @returns An observable that emits the recommendation results with products.
   */
  getRecommendations(
    recommendationsContext: RecommendationsContext
  ): Observable<{ recommendations: Recommendations; products: Partial<Product>[] }>;
}
