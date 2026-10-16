/**
 * Raw product shape returned inside the `icmSearch` tool output.
 */
export interface CopilotEmbeddedProductData {
  sku?: string;
  title?: string;
  price?: null | number;
  currency?: null | string;
  mainImage?: null | string;
  shortDescription?: null | string;
  manufacturer?: null | string;
}

/**
 * Raw `icmSearch` tool output: products are grouped by promotions under `output`.
 */
export interface CopilotEmbeddedProductSearchOutput {
  output?: { products?: CopilotEmbeddedProductData[] }[];
}
