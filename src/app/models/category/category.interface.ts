import { ImageData } from '../image/image.interface';

export interface CategoryData {
  name: string;
  type: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  online: string;
  description: string;
  subCategoriesCount?: number;
  images?: ImageData[];
  id: string;
  subCategories?: CategoryData[];
  uri?: string;
}
