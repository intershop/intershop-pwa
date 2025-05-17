import { Brand } from 'ish-core/models/brand/brand.model';
import { Keyword } from 'ish-core/models/keyword/keyword.model';

export interface Suggestions {
  keywords?: Keyword[];
  brands?: Brand[];
  categories?: string[];
  products?: string[];
}
