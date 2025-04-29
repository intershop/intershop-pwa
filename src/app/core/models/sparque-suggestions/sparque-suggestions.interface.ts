import { Brand } from 'ish-core/models/brand/brand.model';
import { Keyword } from 'ish-core/models/keyword/keyword.model';
import { SparqueCategory } from 'ish-core/models/sparque-category/sparque-category.interface';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';

/**
 * Interface for Sparque Suggestions API response object
 */
export interface SparqueSuggestions {
  keywordSuggestions?: Keyword[];
  products?: SparqueProduct[];
  categories?: SparqueCategory[];
  brands?: Brand[];
}
