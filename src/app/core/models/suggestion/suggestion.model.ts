import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';

export interface Suggestion {
  products?: Product[];
  categories?: Category[];
  brands?: Brand[];
  keywordSuggestions?: string[];
  contentSuggestions?: ContentSuggestion[];
}

export interface Brand {
  name: string;
  productCount: number;
  imageUrl: string;
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
