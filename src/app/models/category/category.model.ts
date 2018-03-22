import { Image } from '../image/image.model';

export interface Category {
  uniqueId: string;

  id: string;
  name: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  subCategories: Category[];
  subCategoriesIds: string[];
  subCategoriesCount: number;
  description: string;
  images: Image[];

  productSkus?: string[];
}

export * from './category.helper';
