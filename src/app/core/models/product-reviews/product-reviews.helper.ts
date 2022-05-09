import { ProductReviews } from './product-reviews.model';

export class ProductReviewsHelper {
  static equal(productReviews1: ProductReviews, productReviews2: ProductReviews): boolean {
    return !!productReviews1 && !!productReviews2 && productReviews1.sku === productReviews2.sku;
  }
}
