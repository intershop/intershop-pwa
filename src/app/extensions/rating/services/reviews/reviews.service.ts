import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { ProductReview, ProductReviewCreationType } from '../../models/product-reviews/product-review.model';
import { ProductReviewsMapper } from '../../models/product-reviews/product-reviews.mapper';
import { ProductReviews } from '../../models/product-reviews/product-reviews.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets the reviews for a given product.
   *
   * @param sku The product sku.
   * @returns   The available reviews of a product.
   */
  getProductReviews(sku: string): Observable<ProductReviews> {
    if (!sku) {
      return throwError(() => new Error('getProductReviews() called without sku'));
    }

    let ownReviewId: string;

    return this.apiService.get(`products/${sku}/reviews?attrs=own`, { sendSPGID: true }).pipe(
      unpackEnvelope<Link>(),
      tap(reviewLinks => {
        ownReviewId = reviewLinks?.find(link =>
          link.attributes.find(attr => attr.name === 'own' && attr.value === true)
        )?.itemId;
      }),
      this.apiService.resolveLinks<ProductReview>(),
      // ToDo: remove this mapping if the own flag is returned by the REST api
      map(reviews => reviews.map(review => ({ ...review, own: review.id === ownReviewId }))),
      map(reviews => ProductReviewsMapper.fromData(sku, reviews))
    );
  }

  /**
   * Creates a user review for a given product, the user name is always sent to the server.
   *
   * @param sku     The product sku.
   * @param review  The review and rating for the product.
   * @returns       The created product review.
   */
  createProductReview(sku: string, review: ProductReviewCreationType) {
    if (!sku) {
      return throwError(() => new Error('createProductReview() called without sku'));
    }
    if (!review) {
      return throwError(() => new Error('createProductReview() called without review'));
    }

    return this.apiService.post(`products/${sku}/reviews`, { ...review, showAuthorNameFlag: true }).pipe(
      this.apiService.resolveLink<ProductReview>(),
      map(review => ProductReviewsMapper.fromData(sku, [{ ...review, own: true }]))
    );
  }

  /**
   * Deletes a review of the current user for a given product.
   *
   * @param sku     The product sku.
   * @param review  The review id.
   */
  deleteProductReview(sku: string, reviewId: string) {
    if (!sku) {
      return throwError(() => new Error('deleteProductReview() called without sku'));
    }
    if (!reviewId) {
      return throwError(() => new Error('deleteProductReview() called without reviewId'));
    }

    return this.apiService.delete(`products/${sku}/reviews/${reviewId}`);
  }
}
