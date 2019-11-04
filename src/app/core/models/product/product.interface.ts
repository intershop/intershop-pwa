import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { CategoryData } from 'ish-core/models/category/category.interface';
import { Image } from 'ish-core/models/image/image.model';
import { Link } from 'ish-core/models/link/link.model';
import { Price } from 'ish-core/models/price/price.model';
import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';
import { SeoAttributes } from 'ish-core/models/seo-attribute/seo-attribute.model';
import { Warranty } from 'ish-core/models/warranty/warranty.model';

export interface ProductData {
  sku: string;
  productName: string;
  shortDescription: string;
  longDescription: string;

  availability: boolean;
  averageRating: string;
  roundedAverageRating: string;

  images: Image[];

  availableWarranties?: Warranty[];
  availableGiftWraps?: unknown[];
  availableGiftMessages?: unknown[];
  bundles: unknown[];
  retailSet: boolean;

  inStock: boolean;

  // If warranty {
  price?: Price;
  currency?: unknown;
  // }

  productMasterSKU?: string;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  packingUnit: string;

  // If Variation Master and Retail Set {
  minListPrice?: Price;
  maxListPrice?: Price;
  minSalePrice?: Price;
  maxSalePrice?: Price;
  // }
  variationAttributeValues?: VariationAttribute[];
  variableVariationAttributes?: VariationAttribute[];
  partOfRetailSet: boolean;
  // If  Retail Set {
  summedUpListPrice?: Price;
  summedUpSalePrice?: Price;
  // }

  attachments?: unknown;
  variations?: unknown;
  crosssells?: unknown;
  productMaster: boolean;
  productBundle: boolean;
  listPrice: Price;
  salePrice: Price;
  manufacturer: string;
  mastered: boolean;
  readyForShipmentMin: number;
  readyForShipmentMax: number;
  attributes?: Attribute[];
  productTypes: string[];
  attributeGroups?: { [id: string]: AttributeGroup };
  defaultCategory?: CategoryData;

  promotions?: Link[];

  seoAttributes: SeoAttributes;
}

export interface ProductDataStub {
  attributeGroups?: { [id: string]: AttributeGroup };
  attributes: Attribute[];
  description: string;
  title: string;
}

export interface ProductVariationLink extends Link {
  variableVariationAttributeValues: VariationAttribute[];
}
