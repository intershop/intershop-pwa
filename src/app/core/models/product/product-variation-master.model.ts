import { Price } from 'ish-core/models/price/price.model';
import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';

import { Product } from './product.model';

export interface VariationProductMaster extends Product {
  variationAttributeValues?: VariationAttribute[];
  minListPrice?: Price;
  minSalePrice?: Price;
  maxListPrice?: Price;
  maxSalePrice?: Price;
}
