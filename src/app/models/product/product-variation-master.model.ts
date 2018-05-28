import { Attribute } from '../attribute/attribute.model';
import { VariationProduct } from './product-variation.model';
import { Product } from './product.model';

export interface VariationProductMaster extends Product {
  variationProducts: VariationProduct[];
  variationAttributes?: Attribute[];
}
