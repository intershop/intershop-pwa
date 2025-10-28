import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from 'ish-core/models/product/product.model';
import { Recommendations, RecommendationsContext } from 'ish-core/models/recommendations/recommendations.model';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { RecommendationsServiceInterface } from 'ish-core/service-provider/recommendations.service-provider';
import { unpackEnvelope } from 'ish-core/services/api/api.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

/**
 * Service for interacting with the Sparque API to retrieve product recommendations.
 * Provides methods to get personalized product recommendations based on various strategies.
 *
 * The service handles the API communication with Sparque's recommendation engine and transforms
 * the response data into Intershop PWA compatible format, including both recommendation metadata
 * and product data.
 */
@Injectable({ providedIn: 'root' })
export class SparqueRecommendationsService implements RecommendationsServiceInterface {
  // API version for Sparque API.
  private readonly apiVersion = 'v3';

  constructor(private sparqueApiService: SparqueApiService, private sparqueProductMapper: SparqueProductMapper) {}

  /**
   * Retrieves product recommendations from the Sparque API based on the provided parameters.
   *
   * @param recommendationsContext - The recommendation context including strategy, product IDs, category, and count.
   * @returns An observable emitting an object containing:
   *   - recommendations: The updated SparqueRecommendations object with productSKUs populated
   *   - products: An array of partial Product objects representing the recommended products
   */
  getRecommendations(
    recommendationsContext: RecommendationsContext
  ): Observable<{ recommendations: Recommendations; products: Partial<Product>[] }> {
    // Build query parameters
    let params = new HttpParams().set('strategyString', recommendationsContext.strategy);

    // Add optional parameters if provided
    if (recommendationsContext.productId) {
      params = params.set('currentProductId', recommendationsContext.productId);
    }

    if (recommendationsContext.categoryId) {
      params = params.set('categoryId', recommendationsContext.categoryId);
    }

    if (recommendationsContext.cartProductIds && recommendationsContext.cartProductIds.length > 0) {
      params = params.set('cartProductIds', recommendationsContext.cartProductIds.join(','));
    }

    if (recommendationsContext.maxCount) {
      params = params.set('count', recommendationsContext.maxCount.toString());
    }

    return this.sparqueApiService
      .get<SparqueProduct[]>('recommendations', this.apiVersion, {
        params,
        skipApiErrorHandling: true,
      })
      .pipe(
        unpackEnvelope<SparqueProduct>('products'),
        map(products => ({
          recommendations: {
            strategy: recommendationsContext.strategy,
            productSKUs: products ? products.map(p => p.sku) : [],
          },
          products: this.sparqueProductMapper.fromListData(products, 2),
        }))
      );
  }
}
