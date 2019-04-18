// tslint:disable:no-any
import { AttributeGroup } from '../attribute-group/attribute-group.model';
import { Attribute } from '../attribute/attribute.model';
import { CategoryData } from '../category/category.interface';
import { Image } from '../image/image.model';
import { Link } from '../link/link.model';
import { Price } from '../price/price.model';
import { ProductPromotion } from '../promotion/promotion.model';
import { VariationAttribute } from '../product-variation/variation-attribute.model';
import { Warranty } from '../warranty/warranty.model';

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
  availableGiftWraps?: any[];
  availableGiftMessages?: any[];
  bundles: any[];
  retailSet: boolean;

  inStock: boolean;

  // If warranty {
  price?: Price;
  currency?: any;
  // }

  productMasterSKU?: string;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  // If Variation Master and Retail Set {
  minListPrice?: number;
  maxListPrice?: number;
  minSalePrice?: number;
  maxSalePrice?: number;
  // }
  variationAttributeValues?: Attribute[];
  variableVariationAttributes?: Attribute[];
  partOfRetailSet: boolean;
  // If  Retail Set {
  summedUpListPrice?: number;
  summedUpSalePrice?: number;
  // }

  attachments?: any;
  variations?: any;
  crosssells?: any;
  productMaster: boolean;
  listPrice: Price;
  productBundle: boolean;
  salePrice: Price;
  manufacturer: string;
  mastered: boolean;
  readyForShipmentMin: number;
  readyForShipmentMax: number;
  attributes?: Attribute[];
  attributeGroups?: { [id: string]: AttributeGroup };
  defaultCategory?: CategoryData;

  promotions?: ProductPromotion[];
}

export interface ProductDataStub {
  attributeGroups?: { [id: string]: AttributeGroup };
  attributes: Attribute[];
  description: string;
  title: string;
  defaultCategory?: CategoryData;
}

export interface ProductVariationLink extends Link {
  variableVariationAttributeValues: VariationAttribute[];
}
