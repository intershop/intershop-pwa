import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';
import { Price } from 'ish-core/models/price/price.model';
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
  minListPrice?: Price;
  minSalePrice?: Price;
  maxListPrice?: Price;
  maxSalePrice?: Price;
}

export interface ProductRetailSet extends Product {
  type: 'RetailSet';
  minListPrice: Price;
  minSalePrice: Price;
  summedUpListPrice: Price;
  summedUpSalePrice: Price;
}

export interface ProductBundle extends Product {
  type: 'Bundle';
}

export type AllProductTypes = Product | VariationProduct | VariationProductMaster | ProductBundle | ProductRetailSet;

export * from './product.helper';
