import { Attribute } from '../attribute/attribute.model';
import { Image } from '../image/image.model';

import { Product } from './product.model';
import { ProductType } from './product.types';

export class ProductHelper {
  /**
   * Get primary product image based on image type
   * @param product   The Product for which to get the primary image
   * @param imageType The wanted ImageType
   * @returns         The primary product image of the given ImageType
   */
  static getPrimaryImage(product: Product, imageType: string): Image {
    if (!(product && product.images)) {
      return;
    }
    return product.images.find(image => image.typeID === imageType && image.primaryImage);
  }

  /**
   * Get product image based on image type and image view
   * @param product   The Product for which to get the image
   * @param imageType The wanted ImageType
   * @param imageView The wanted ImageView
   * @returns         The matching product image
   */
  static getImageByImageTypeAndImageView(product: Product, imageType: string, imageView: string): Image {
    if (!(product && product.images)) {
      return;
    }
    return product.images.find(image => image.typeID === imageType && image.viewID === imageView);
  }

  /**
   * Get all product ImageView ids excluding the primary product image
   * @param product   The Product for which to get the image types
   * @param imageType The wanted ImageType
   * @returns         Array of available ImageView ids
   */
  static getImageViewIDsExcludePrimary(product: Product, imageType: string): string[] {
    if (!(product && product.images)) {
      return [];
    }
    return product.images.filter(image => image.typeID === imageType && !image.primaryImage).map(image => image.viewID);
  }

  /**
   * Check if product is a master product
   */
  static isMasterProduct(product: Product): boolean {
    return product.type === ProductType.VariationProductMaster;
  }

  /**
   * Get a specific product attribute by attribute name.
   * @param product       The Product for which to get the attribute
   * @param attributeName The attribute name of the attribute to get
   * @returns              The matching product attribute
   */
  static getAttributeByAttributeName(product: { attributes: Attribute[] }, attributeName: string): Attribute {
    if (!(product && product.attributes)) {
      return;
    }
    return product.attributes.find(attribute => attribute.name === attributeName);
  }

  /**
   * Get product attributes by attribute group id.
   * @param product           The Product for which to get the attributes
   * @param attributeGroupId  The attribute group id of the attributes to get
   * @returns                 The product attributes of the attribute group (if any)
   */
  static getAttributesOfGroup(product: Product, attributeGroupId: string): Attribute[] {
    if (
      product &&
      product.attributeGroups &&
      product.attributeGroups[attributeGroupId] &&
      product.attributeGroups[attributeGroupId].attributes &&
      product.attributeGroups[attributeGroupId].attributes.length > 0
    ) {
      return product.attributeGroups[attributeGroupId].attributes;
    }
    return;
  }
}
