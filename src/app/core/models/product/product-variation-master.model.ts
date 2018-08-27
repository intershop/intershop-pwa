import { VariationAttribute } from '../variation-attribute/variation-attribute.model';

import { Product } from './product.model';

export interface VariationProductMaster extends Product {
  variationAttributeValues?: VariationAttribute[];
}
