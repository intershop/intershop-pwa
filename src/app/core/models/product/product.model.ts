import { Attachment } from 'ish-core/models/attachment/attachment.model';
import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';
import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';
import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';

export interface Product {
  name: string;
  shortDescription: string;
  longDescription: string;
  available: boolean;
  availableStock?: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  stepOrderQuantity: number;
  attributes: Attribute[];
  attributeGroups?: { [id: string]: AttributeGroup };
  attachments?: Attachment[];
  images: Image[];
  manufacturer: string;
  roundedAverageRating: number;
  numberOfReviews: number;
  readyForShipmentMin: number;
  readyForShipmentMax: number;
  sku: string;
  defaultCategoryId?: string;
  packingUnit: string;

  // properties added in model
  type: string;
  promotionIds: string[];
  completenessLevel: number;
  failed: boolean;
  seoAttributes?: SeoAttributes;
}

export interface VariationProduct extends Product {
  type: 'VariationProduct';
  variableVariationAttributes?: VariationAttribute[];
  productMasterSKU?: string;
}

export interface VariationProductMaster extends Product {
  type: 'VariationProductMaster';
  variationAttributeValues?: VariationAttribute[];
}

export interface ProductRetailSet extends Product {
  type: 'RetailSet';
}

export interface ProductBundle extends Product {
  type: 'Bundle';
}

export type AllProductTypes = Product | VariationProduct | VariationProductMaster | ProductBundle | ProductRetailSet;

export * from './product.helper';
