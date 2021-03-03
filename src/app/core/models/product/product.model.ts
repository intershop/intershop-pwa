import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';
import { Price } from 'ish-core/models/price/price.model';
import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';

export interface Product {
  name: string;
  shortDescription: string;
  longDescription: string;
  available: boolean;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  stepOrderQuantity: number;
  attributes: Attribute[];
  attributeGroups?: { [id: string]: AttributeGroup };
  images: Image[];
  listPrice: Price;
  salePrice: Price;
  manufacturer: string;
  roundedAverageRating: number;
  readyForShipmentMin: number;
  readyForShipmentMax: number;
  sku: string;
  defaultCategoryId?: string;
  packingUnit: string;

  // properties added in model
  type: 'Product' | 'VariationProduct' | 'VariationProductMaster' | 'Bundle' | 'RetailSet' | string;
  promotionIds: string[];
  completenessLevel: number;
  failed: boolean;
  seoAttributes?: SeoAttributes;
}

export * from './product.helper';
