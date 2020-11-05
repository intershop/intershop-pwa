import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';
import { SeoAttributesData } from 'ish-core/models/seo-attributes/seo-attributes.interface';

export interface CategoryPathElement {
  id: string;
  name: string;
  uri: string;
}

export interface CategoryData {
  categoryRef: string;
  name: string;
  hasOnlineProducts: boolean;
  hasOnlineSubCategories: boolean;
  online: string;
  description: string;
  subCategories?: CategoryData[];
  images?: Image[];
  uri?: string;
  categoryPath: CategoryPathElement[];
  attributes: Attribute[];
  seoAttributes: SeoAttributesData;
}
