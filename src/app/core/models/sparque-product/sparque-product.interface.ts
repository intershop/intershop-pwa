import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { SparqueImage } from 'ish-core/models/sparque-image/sparque-image.interface';
import { SparqueOffer } from 'ish-core/models/sparque-offer/sparque-offer.interface';

export interface SparqueProduct {
  sku: string;
  name: string;
  defaultBrandName?: string;
  defaultcategoryId: string;
  gtin?: string;
  shortDescription?: string;
  longDescription?: string;
  manufacturer?: string;
  type?: string;
  rank?: number;
  offers?: SparqueOffer[];
  productVariants?: string[];
  productMaster?: string;
  attributes?: Attribute[];
  images: SparqueImage[];
  attachments?: SparqueAttachment[];
  variantAttributes?: SparqueVariantAttribute[];
}

interface SparqueVariantAttribute {
  id: string;
  value: string;
  name: string;
  sku: string;
}

export interface SparqueAttachment {
  id: string;
  extension?: string;
  relativeUrl: string;
  attributes?: Attribute[];
}
