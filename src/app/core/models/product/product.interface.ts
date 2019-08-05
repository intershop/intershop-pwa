// tslint:disable:no-any
import { AttributeGroup } from '../attribute-group/attribute-group.model';
import { Attribute } from '../attribute/attribute.model';
import { CategoryData } from '../category/category.interface';
import { Image } from '../image/image.model';
import { Link } from '../link/link.model';
import { Price } from '../price/price.model';
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

  attachments?: any;
  variations?: any;
  crosssells?: any;
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
}

export interface ProductDataStub {
  attributeGroups?: { [id: string]: AttributeGroup };
  attributes: Attribute[];
  description: string;
  title: string;
  defaultCategory?: CategoryData;
  roundedAverageRating?: string;
}

export interface ProductVariationLink extends Link {
  variableVariationAttributeValues: VariationAttribute[];
}
