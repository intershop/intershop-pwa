import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import {
  getProductReviewsBySku,
  getProductReviewsError,
  getProductReviewsLoading,
  loadProductReviews,
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
}
