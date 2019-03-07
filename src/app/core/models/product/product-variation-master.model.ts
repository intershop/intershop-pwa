import { VariationAttribute } from '../variation-attribute/variation-attribute.model';

import { Product, ProductType } from './product.model';

export interface VariationProductMaster extends Product {
  type: ProductType.VariationProductMaster;
  variationAttributeValues?: VariationAttribute[];
}
