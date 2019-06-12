import { AttributeGroup } from '../attribute-group/attribute-group.model';
import { Attribute } from '../attribute/attribute.model';
import { Image } from '../image/image.model';
import { Price } from '../price/price.model';

export interface Product {
  name: string;
  shortDescription: string;
  longDescription: string;
  availability: boolean;
  inStock: boolean;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  attributes: Attribute[];
  attributeGroups?: { [id: string]: AttributeGroup };
  images: Image[];
  listPrice: Price;
  salePrice: Price;
  manufacturer: string;
  readyForShipmentMin: number;
  readyForShipmentMax: number;
  sku: string;
  defaultCategoryId?: string;

  // properties added in model
  type: 'Product' | 'VariationProduct' | 'VariationProductMaster';
  promotionIds: string[];
  completenessLevel: number;
  failed: boolean;
}

export * from './product.helper';
