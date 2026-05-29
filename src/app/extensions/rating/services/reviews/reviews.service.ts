import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { ProductReview, ProductReviewCreationType } from '../../models/product-reviews/product-review.model';
import { ProductReviewsMapper } from '../../models/product-reviews/product-reviews.mapper';
import { ProductReviews } from '../../models/product-reviews/product-reviews.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private apiService: ApiService) {}

  /**
   * Gets the reviews for a given product. If the user is logged in, a second request
   * fetches the user's own reviews to mark them accordingly and include any that are
   * not yet publicly visible (e.g. pending approval). Furthermore, the second request
   * is not cached for logged in users, to ensure that the user always sees their
   * latest reviews, even if they are not yet approved.
   *
   * @param sku         The product sku.
   * @param isLoggedIn  Whether the current user is logged in.
   * @returns           The available reviews of a product.
   */
  getProductReviews(sku: string, isLoggedIn: boolean): Observable<ProductReviews> {
    if (!sku) {
      return throwError(() => new Error('getProductReviews() called without sku'));
    }

    const params = new HttpParams().set('own', 'false');
    return this.apiService
      .get(`products/${this.apiService.encodeResourceId(sku)}/reviews`, { sendSPGID: true, params })
      .pipe(
        unpackEnvelope<Link>(),
        this.apiService.resolveLinks<ProductReview>(),
        map(reviews => ProductReviewsMapper.fromData(sku, reviews)),
        switchMap(allReviews =>
          isLoggedIn
            ? this.apiService
                .get(`products/${this.apiService.encodeResourceId(sku)}/reviews`, {
                  sendSPGID: true,
                  params: new HttpParams().set('own', 'true'),
                })
                .pipe(
                  unpackEnvelope<Link>(),
                  this.apiService.resolveLinks<ProductReview>(),
                  map(ownReviews => ({
                    ...allReviews,
                    reviews: [...allReviews.reviews, ...ProductReviewsMapper.fromData(sku, ownReviews).reviews],
                  }))
                )
            : of(allReviews)
        )
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

    return this.apiService
      .post(`products/${this.apiService.encodeResourceId(sku)}/reviews`, { ...review, showAuthorNameFlag: true })
      .pipe(
        this.apiService.resolveLink<ProductReview>(),
        map(data => ProductReviewsMapper.fromData(sku, [{ ...data, own: true }]))
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

    return this.apiService.delete(
      `products/${this.apiService.encodeResourceId(sku)}/reviews/${this.apiService.encodeResourceId(reviewId)}`
    );
  }
}
