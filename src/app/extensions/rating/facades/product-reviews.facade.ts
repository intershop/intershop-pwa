import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ProductReview, ProductReviewCreationType } from '../models/product-reviews/product-review.model';
import {
  createProductReview,
  deleteProductReview,
  getProductReviewsBySku,
  getProductReviewsError,
  getProductReviewsLoading,
  loadProductReviews,
  resetProductReviewError,
} from '../store/product-reviews';

@Injectable({ providedIn: 'root' })
export class ProductReviewsFacade {
  constructor(private store: Store) {}

  productReviewsError$ = this.store.pipe(select(getProductReviewsError));
  productReviewsLoading$ = this.store.pipe(select(getProductReviewsLoading));

  getProductReviews$(sku: string) {
    this.store.dispatch(loadProductReviews({ sku }));
    return this.store.pipe(select(getProductReviewsBySku(sku)));
  }

  createProductReview(sku: string, review: ProductReviewCreationType) {
    this.store.dispatch(createProductReview({ sku, review }));
  }

  deleteProductReview(sku: string, review: ProductReview): void {
    this.store.dispatch(deleteProductReview({ sku, review }));
  }

  resetProductReviewError() {
    this.store.dispatch(resetProductReviewError());
  }
}
