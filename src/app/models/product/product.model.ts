import { Attribute } from '../attribute/attribute.model';
import { Image } from '../image/image.model';
import { Price } from '../price/price.model';
import { ProductType } from './product.types';

export interface Product {
  name: string;
  shortDescription: string;
  longDescription: string;
  availability: boolean;
  inStock: boolean;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  attributes: Attribute[];
  images: Image[];
  listPrice: Price;
  salePrice: Price;
  manufacturer: string;
  readyForShipmentMin: number;
  readyForShipmentMax: number;
  sku: string;

  type: ProductType;
}

export * from './product.helper';
export * from './product.types';
