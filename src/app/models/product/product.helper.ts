import { Image } from '../image/image.model';
import { Product } from './product.model';
import { ProductType } from './product.types';

export class ProductHelper {

  /**
   * Get image based on image type and image view
   * @param  {string} imageType
   * @param  {string} imageView
   * @returns Image
   */
  static getImageByImageTypeAndImageView(product: Product, imageType: string, imageView: string): Image {
    return product.images.find(image => image.typeID === imageType && image.viewID === imageView);
  }

  /**
   * Get primary image based on image type
   * @param  {string} imageType
   * @returns Image
   */
  static getPrimaryImage(product: Product, imageType: string): Image {
    return product.images.find(image => image.typeID === imageType && image.primaryImage);
  }

  /**
  * Get all images excluding primary images
  * @param  {string} imageType
  * @returns string[]
  */
  static getImageViewIDsExcludePrimary(product: Product, imageType: string): string[] {
    return product.images
      .filter(image => image.typeID === imageType && !image.primaryImage)
      .map(image => image.viewID);
  }

  /**
   * Check if product is a master product
   */
  static isMasterProduct(product: Product): boolean {
    return product.type === ProductType.VariationProductMaster;
  }
}
