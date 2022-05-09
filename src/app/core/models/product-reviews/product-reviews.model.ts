import { ProductReviewData } from './product-reviews.interface';

export interface ProductReviews {
  sku: string;
  reviews: ProductReviewData[];
}
