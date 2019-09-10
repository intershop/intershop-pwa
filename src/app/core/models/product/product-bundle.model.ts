import { Product } from './product.model';

import { SkuQuantityType } from './product.helper';

export interface ProductBundle extends Product {
  bundledProducts: SkuQuantityType[];
}
