import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface SparqueCategory {
  categoryID: string;
  categoryName: string;
  categoryURL?: string;
  totalCount: number;
  position?: number;
  parentCategoryId?: string;
  subCategories?: SparqueCategory[];
  attributes?: Attribute[];
  deep?: number;
}

export interface SparqueParentCategory {
  identifier: string;
  name: SparqueLocalizedValue;
  description?: SparqueLocalizedValue;
  image?: string;
  hasParent?: SparqueParentCategory[];
  root?: number;
}

interface SparqueLocalizedValue {
  [localeId: string]: string;
}
