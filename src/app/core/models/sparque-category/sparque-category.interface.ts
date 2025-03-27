import { SparqueAttribute } from 'ish-core/models/sparque/sparque.interface';

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
  attributes?: SparqueAttribute[];
  deep?: number;
}
