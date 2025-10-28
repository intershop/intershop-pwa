export interface Recommendations {
  strategy: string;
  productSKUs: string[];
}

export interface RecommendationsParams {
  strategy: string;
  maxCount?: number;
}

export interface RecommendationsContext extends RecommendationsParams {
  productId?: string;
  categoryId?: string;
  cartProductIds?: string[];
}
