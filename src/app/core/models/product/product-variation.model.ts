import { VariationAttribute } from '../variation-attribute/variation-attribute.model';

import { Product, ProductType } from './product.model';

export interface VariationProduct extends Product {
  type: ProductType.VariationProduct;
  variableVariationAttributes?: VariationAttribute[];
  productMasterSKU: string;
}
