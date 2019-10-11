import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';

import { Product } from './product.model';

export interface VariationProduct extends Product {
  variableVariationAttributes?: VariationAttribute[];
  productMasterSKU?: string;
}
