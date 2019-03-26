import { Attribute } from '../attribute/attribute.model';
import { Image } from '../image/image.model';
import { ProductView, VariationProductMasterView, VariationProductView } from '../product-view/product-view.model';

import { VariationProductMaster } from './product-variation-master.model';
import { VariationProduct } from './product-variation.model';
import { Product } from './product.model';

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
   * check if a given product has the maximum completeness level
   */
  static isProductCompletelyLoaded(product: Product): boolean {
    return !!product && !!product.attributes; // TODO: implement completeness level – this is just a workaround to get things working
  }

  /**
   * Check if product is a master product
   */
  static isMasterProduct(product: Product): product is VariationProductMaster | VariationProductMasterView {
    return product && product.type === 'VariationProductMaster';
  }

  /**
   * Check if product is a master product
   */
  static isVariationProduct(product: Product): product is VariationProduct | VariationProductView {
    return product && product.type === 'VariationProduct';
  }

  static hasVariations(
    product: ProductView | VariationProductView | VariationProductMasterView
  ): product is VariationProductView | VariationProductMasterView {
    return (
      (ProductHelper.isVariationProduct(product) || ProductHelper.isMasterProduct(product)) &&
      !!product.variations().length
    );
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
