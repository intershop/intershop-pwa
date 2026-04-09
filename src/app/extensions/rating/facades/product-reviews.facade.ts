import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { ModuleLoaderService } from 'ish-core/utils/module-loader/module-loader.service';

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
  private moduleLoader = inject(ModuleLoaderService);

  constructor(private store: Store) {}

  productReviewsError$ = this.moduleLoader.whenLoaded('rating', () => this.store.pipe(select(getProductReviewsError)));
  productReviewsLoading$ = this.moduleLoader.whenLoaded('rating', () =>
    this.store.pipe(select(getProductReviewsLoading))
  );

  getProductReviews$(sku: string) {
    return this.moduleLoader.whenLoaded('rating', () => {
      this.store.dispatch(loadProductReviews({ sku }));
      return this.store.pipe(select(getProductReviewsBySku(sku)));
    });
  }

  createProductReview(sku: string, review: ProductReviewCreationType) {
    void this.moduleLoader.ensureLoaded('rating').then(() => this.store.dispatch(createProductReview({ sku, review })));
  }

  deleteProductReview(sku: string, review: ProductReview): void {
    void this.moduleLoader.ensureLoaded('rating').then(() => this.store.dispatch(deleteProductReview({ sku, review })));
  }

  resetProductReviewError() {
    void this.moduleLoader.ensureLoaded('rating').then(() => this.store.dispatch(resetProductReviewError()));
  }
}
