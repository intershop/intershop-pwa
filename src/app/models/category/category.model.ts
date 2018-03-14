import { Image } from '../image/image.model';

export interface Category {

  id: string;
  name: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  subCategories: Category[];
  subCategoriesIds: string[];
  subCategoriesCount: number;
  uniqueId: string;
  description: string;
  images: Image[];

  productSkus?: string[];
}

export * from './category.helper';
