import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';

export interface CategoryPathElement {
  id: string;
  name: string;
  uri: string;
}

export interface CategoryData {
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
}
