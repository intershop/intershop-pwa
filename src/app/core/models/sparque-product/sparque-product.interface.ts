import { SparqueImage } from 'ish-core/models/sparque-image/sparque-image.interface';

export interface SparqueProduct {
  sku: string;
  name: string;
  defaultBrandName?: string;
  shortDescription?: string;
  longDescription?: string;
  images?: SparqueImage[];
  defaultCategoryId?: string;
}
