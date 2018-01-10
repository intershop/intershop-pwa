import { Attribute } from '../attribute/attribute.model';
import { VariationProduct } from './product-variation.model';
import { Product } from './product.model';

export class VariationProductMaster extends Product {

  variationProduct: VariationProduct[];
  variationAttributes?: Attribute[];
  variations: string;

  minListPrice: number;
  maxListPrice: number;
  minSalePrice: number;
  maxSalePrice: number;

}
