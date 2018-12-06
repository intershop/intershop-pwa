import { Attribute } from '../attribute/attribute.model';

import { Product } from './product.model';

export interface VariationProduct extends Product {
  variationAttributes?: Attribute[];
  productMasterSKU: string;
}
