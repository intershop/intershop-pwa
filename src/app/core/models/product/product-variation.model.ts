import { VariationAttribute } from '../product-variation/variation-attribute.model';

import { Product, ProductType } from './product.model';

export interface VariationProduct extends Product {
  type: ProductType.VariationProduct;
  variableVariationAttributes?: VariationAttribute[];
  productMasterSKU: string;
}
