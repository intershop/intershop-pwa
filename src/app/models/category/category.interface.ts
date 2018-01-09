import { Image } from '../image.model';

export interface CategoryData {
  name: string;
  type: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  online: string;
  description: string;
  subCategoriesCount?: number;
  images?: Image[];
  id: string;
  subCategories?: CategoryData[];
  uri?: string;
}
