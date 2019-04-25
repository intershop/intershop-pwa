import { Attribute } from '../attribute/attribute.model';
import { Image } from '../image/image.model';

export interface Category {
  uniqueId: string;

  categoryPath: string[];
  name: string;
  hasOnlineProducts: boolean;
  description: string;
  images: Image[];
  attributes: Attribute[];

  completenessLevel: number;
}

export * from './category.helper';
