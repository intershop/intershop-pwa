import { Injectable } from '@angular/core';

import { ProductReview } from './product-review.model';
import { ProductReviews } from './product-reviews.model';

@Injectable({ providedIn: 'root' })
export class ProductReviewsMapper {
  static fromData(sku: string, productReviews: ProductReview[]): ProductReviews {
    if (productReviews) {
      return { sku, reviews: productReviews };
    } else {
      throw new Error(`productReviewsData is required`);
    }
  }
}
