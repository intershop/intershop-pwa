import { Injectable } from '@angular/core';

import { ProductReviewData } from './product-reviews.interface';
import { ProductReviews } from './product-reviews.model';

@Injectable({ providedIn: 'root' })
export class ProductReviewsMapper {
  static fromData(productReviewsData: ProductReviewData[], sku: string): ProductReviews {
    if (productReviewsData) {
      return { sku, reviews: productReviewsData };
    } else {
      throw new Error(`productReviewsData is required`);
    }
  }
}
