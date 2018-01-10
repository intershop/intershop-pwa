import { Attribute } from '../attribute/attribute.model';
import { Image } from '../image/image.model';
import { Price } from '../price.model';
import { ShippingMethod } from '../shipping-method.model';

export class Product {

  id: string;
  sku: string;
  name: string;
  productName: string;
  type: string;

  salePrice: Price;
  listPrice: Price;

  minOrderQuantity: number;

  shortDescription: string;
  longDescription: string;
  attributes: Attribute[];

  shippingMethods: ShippingMethod[];
  readyForShipmentMin: number;
  readyForShipmentMax: number;

  images: Image[];

  manufacturer: string;

  availability: boolean;

  inStock: boolean;

  showAddToCart: boolean;

  applicablePromotions: any[];

  nameOverride: string;
  showInformationalPrice: boolean;
}
