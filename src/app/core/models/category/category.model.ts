import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';
import { SeoAttributes } from 'ish-core/models/seo-attribute/seo-attribute.model';

export interface Category {
  uniqueId: string;

  categoryPath: string[];
  name: string;
  hasOnlineProducts: boolean;
  description: string;
  images: Image[];
  attributes: Attribute[];

  completenessLevel: number;

  seoAttributes?: SeoAttributes;
}

export * from './category.helper';
