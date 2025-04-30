import { Brand } from 'ish-core/models/brand/brand.model';
import { Category } from 'ish-core/models/category/category.model';
import { Keyword } from 'ish-core/models/keyword/keyword.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { Product } from 'ish-core/models/product/product.model';

export interface Suggestions {
  keywords?: Keyword[];
  products?: Partial<Product>[];
  categories?: Category[];
  brands?: Brand[];
  prices?: ProductPriceDetails[];
}
