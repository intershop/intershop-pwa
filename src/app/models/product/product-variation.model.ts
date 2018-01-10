import { Attribute } from '../attribute/attribute.model';
import { Product } from './product.model';

export class VariationProduct extends Product {

  variationAttributes?: Attribute[];

  constructor(sku: string, masterSKU: string) {
    super(sku);
  }
}
