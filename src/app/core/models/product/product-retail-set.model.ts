import { Price } from 'ish-core/models/price/price.model';

import { Product } from './product.model';

export interface ProductRetailSet extends Product {
  type: 'RetailSet';
  minListPrice: Price;
  minSalePrice: Price;
  summedUpListPrice: Price;
  summedUpSalePrice: Price;
}
