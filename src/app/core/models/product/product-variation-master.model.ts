import { Price } from '../price/price.model';
import { VariationAttribute } from '../product-variation/variation-attribute.model';

import { Product } from './product.model';

export interface VariationProductMaster extends Product {
  variationAttributeValues?: VariationAttribute[];
  variationSKUs?: string[];
  defaultVariationSKU?: string;
  minListPrice?: Price;
  minSalePrice?: Price;
  maxListPrice?: Price;
  maxSalePrice?: Price;
}
