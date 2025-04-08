import { SparqueCategory } from 'ish-core/models/sparque-category/sparque-category.interface';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';
import { Brand, ContentSuggestion } from 'ish-core/models/suggestion/suggestion.model';

/**
 * Interface for Sparque Suggestions API response object
 */
export interface SparqueSuggestions {
  products?: SparqueProduct[];
  categories?: SparqueCategory[];
  brands?: Brand[];
  keywordSuggestions?: SparqueKeywordSuggestions[];
  contentSuggestions?: ContentSuggestion[];
}

export interface SparqueKeywordSuggestions {
  keyword: string;
}
