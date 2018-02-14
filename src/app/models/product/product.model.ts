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

  /**
    * Constructor
    * @param  {string} public sku
    */
  constructor(public sku: string) { }

  /**
   * Get image based on image type and image view
   * @param  {string} imageType
   * @param  {string} imageView
   * @returns Image
   */
  getImageByImageTypeAndImageView(imageType: string, imageView: string): Image {
    return this.images.find(image => image.typeID === imageType && image.viewID === imageView);
  }

  /**
   * Get primary image based on image type
   * @param  {string} imageType
   * @returns Image
   */
  getPrimaryImage(imageType: string): Image {
    return this.images.find(image => image.typeID === imageType && image.primaryImage);
  }

  /**
  * Get all images excluding primary images
  * @param  {string} imageType
  * @returns string[]
  */
  getImageViewIDsExcludePrimary(imageType: string): string[] {
    return this.images
      .filter(image => image.typeID === imageType && !image.primaryImage)
      .map(image => image.viewID);
  }

}
