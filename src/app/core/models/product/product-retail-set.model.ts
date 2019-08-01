import { Price } from '../price/price.model';

import { Product } from './product.model';

export interface ProductRetailSet extends Product {
  minListPrice: Price;
  minSalePrice: Price;
  summedUpListPrice: Price;
  summedUpSalePrice: Price;
  partSKUs: string[];
}
