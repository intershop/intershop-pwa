import { Attribute } from '../attribute/attribute.model';
import { Image } from '../image/image.model';
import { Price } from '../price/price.model';

export class Product {


  name: string;
  shortDescription: string;
  longDescription: string;
  availability: boolean;
  inStock: boolean;
  minOrderQuantity: number;
  attributes?: Attribute[];
  images: Image[];
  listPrice: Price;
  salePrice: Price;
  manufacturer: string;

  constructor(public sku: string) { }
}
