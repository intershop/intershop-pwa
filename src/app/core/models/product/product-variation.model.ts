import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';

import { Product } from './product.model';

export interface VariationProduct extends Product {
  type: 'VariationProduct';
  variableVariationAttributes?: VariationAttribute[];
  productMasterSKU?: string;
}
