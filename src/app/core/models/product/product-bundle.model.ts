import { SkuQuantityType } from './product.helper';
import { Product } from './product.model';

export interface ProductBundle extends Product {
  bundledProducts: SkuQuantityType[];
}
