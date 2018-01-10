import { Attribute } from '../attribute/attribute.model';
import { Product } from './product.model';

export class VariationProduct extends Product {

  variationAttributes?: Attribute[];
  mastered: boolean;

}
