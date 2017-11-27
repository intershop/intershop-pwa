import {Image} from './image.model';

export class Category {
  name: string;
  type: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  online: string;
  description: string;
  subCategoriesCount?: number;
  images?: Image[];
  id: string;
  subCategories?: Category[];
  uri?: string;
}
