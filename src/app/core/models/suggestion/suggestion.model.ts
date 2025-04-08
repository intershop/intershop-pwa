import { Category } from 'ish-core/models/category/category.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { Product } from 'ish-core/models/product/product.model';

export interface Suggestion {
  products?: Partial<Product>[];
  categories?: Category[];
  brands?: Brand[];
  keywordSuggestions?: string[];
  contentSuggestions?: ContentSuggestion[];
  prices?: ProductPriceDetails[];
}

export interface Brand {
  brandName: string;
  totalCount: number;
}

export interface ContentSuggestion {
  newsType: string;
  paragraph: string;
  slug: string;
  summary: string;
  title: string;
  type: string;
  articleDate: Date;
}
