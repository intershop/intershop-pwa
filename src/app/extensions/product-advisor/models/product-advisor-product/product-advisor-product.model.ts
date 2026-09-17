/**
 * A product recommended by the Product Advisor, extracted from the `icmSearch` tool output.
 */
export interface ProductAdvisorProduct {
  sku: string;
  title?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  shortDescription?: string;
  manufacturer?: string;
}
