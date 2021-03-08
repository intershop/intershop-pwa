import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { CategoryData } from 'ish-core/models/category/category.interface';
import { Image } from 'ish-core/models/image/image.model';
import { Link } from 'ish-core/models/link/link.model';
import { PriceData } from 'ish-core/models/price/price.interface';
import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';
import { SeoAttributesData } from 'ish-core/models/seo-attributes/seo-attributes.interface';
import { Warranty } from 'ish-core/models/warranty/warranty.model';

export interface ProductData {
  sku: string;
  productName: string;
  shortDescription: string;
  longDescription: string;

  availability: boolean;
  inStock: boolean;
  availableStock?: number;

  averageRating: string;
  roundedAverageRating: string;

  images: Image[];

  availableWarranties?: Warranty[];
  availableGiftWraps?: unknown[];
  availableGiftMessages?: unknown[];
  bundles: unknown[];
  retailSet: boolean;

  // If warranty {
  price?: PriceData;
  currency?: unknown;
  // }

  productMasterSKU?: string;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  stepOrderQuantity?: number;
  packingUnit: string;

  // If Variation Master and Retail Set {
  minListPrice?: PriceData;
  maxListPrice?: PriceData;
  minSalePrice?: PriceData;
  maxSalePrice?: PriceData;
  // }
  variationAttributeValues?: VariationAttribute[];
  variableVariationAttributes?: VariationAttribute[];
  partOfRetailSet: boolean;
  // If  Retail Set {
  summedUpListPrice?: PriceData;
  summedUpSalePrice?: PriceData;
  // }

  attachments?: unknown;
  variations?: unknown;
  crosssells?: unknown;
  productMaster: boolean;
  productBundle: boolean;
  listPrice: PriceData;
  salePrice: PriceData;
  manufacturer: string;
  mastered: boolean;
  readyForShipmentMin: number;
  readyForShipmentMax: number;
  attributes?: Attribute[];
  productTypes: string[];
  attributeGroups?: { [id: string]: AttributeGroup };
  defaultCategory?: CategoryData;

  promotions?: Link[];

  seoAttributes: SeoAttributesData;
}

export interface ProductDataStub {
  attributeGroup?: { name: string; attributes: Attribute[] };
  attributes: Attribute[];
  description: string;
  title: string;
}

export interface ProductVariationLink extends Link {
  variableVariationAttributeValues: VariationAttribute[];
}
