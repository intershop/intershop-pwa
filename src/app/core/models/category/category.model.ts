import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';
import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';

export interface Category {
  uniqueId: string;
  categoryRef: string;

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
