import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { ProductReview } from '../../models/product-reviews/product-review.model';
import { ProductReviewsMapper } from '../../models/product-reviews/product-reviews.mapper';
import { ProductReviews } from '../../models/product-reviews/product-reviews.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets the reviews for a given product
   *
   * @param sku The product sku
   * @returns   The available reviews of a product
   */
  getProductReviews(sku: string): Observable<ProductReviews> {
    if (!sku) {
      return throwError(() => new Error('getProductReviews() called without sku'));
    }

    return this.apiService.get(`products/${sku}/reviews`).pipe(
      unpackEnvelope<Link>(),
      this.apiService.resolveLinks<ProductReview>(),
      map(reviews => ProductReviewsMapper.fromData(sku, reviews))
    );
  }
}
