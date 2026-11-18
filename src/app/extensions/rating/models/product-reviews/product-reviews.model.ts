import { ProductReview } from '../product-review/product-review.model';

export interface ProductReviews {
  sku: string;
  reviews: ProductReview[];
}
