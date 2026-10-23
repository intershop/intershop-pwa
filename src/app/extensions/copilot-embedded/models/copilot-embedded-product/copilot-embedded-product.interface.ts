/**
 * Raw product shape returned inside the `icmSearch` tool output.
 */
export interface CopilotEmbeddedProductData {
  sku: string;
  title?: string;
  price?: number;
  currency?: string;
  mainImage?: string;
  shortDescription?: string;
  manufacturer?: string;
}
