import { Injectable } from '@angular/core';

import { ProductReview } from './product-review.model';
import { ProductReviews } from './product-reviews.model';

@Injectable({ providedIn: 'root' })
export class ProductReviewsMapper {
  static fromData(sku: string, productReviews: ProductReview[]): ProductReviews {
    if (productReviews) {
      const reviews = productReviews.map(review => ({
        ...review,
        status: review.status?.startsWith('NEW') ? 'NEW' : review.status,
      }));

      return { sku, reviews };
    } else {
      throw new Error(`productReviews data is required`);
    }
  }
}
