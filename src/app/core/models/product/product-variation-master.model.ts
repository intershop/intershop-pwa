import { VariationAttribute } from '../product-variation/variation-attribute.model';

import { Product } from './product.model';

export interface VariationProductMaster extends Product {
  variationAttributeValues?: VariationAttribute[];
  variationSKUs?: string[];
}
