import { Attribute } from 'ish-core/models/attribute/attribute.model';

export interface SparqueCategoryTree {
  categories?: SparqueCategory[];
  errors?: string[];
}

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
