import { Image } from '../image/image.model';

export interface Category {
  uniqueId: string;

  categoryPath: string[];
  name: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  description: string;
  images: Image[];

  completelyLoaded: boolean;
}

export * from './category.helper';
