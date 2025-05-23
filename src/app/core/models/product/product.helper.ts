import { intersection } from 'lodash-es';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import {
  AllProductTypes,
  Product,
  ProductBundle,
  ProductRetailSet,
  VariationProduct,
  VariationProductMaster,
} from './product.model';

export interface SkuQuantityType {
  sku: string;
  quantity: number;
  unit?: string;
}

export enum ProductCompletenessLevel {
  Detail = 3,
  List = 2,
  Base = 1,
}

export class ProductHelper {
  /**
   * Get primary product image based on image type
   *
   * @param product   The Product for which to get the primary image
   * @param imageType The wanted ImageType
   * @returns         The primary product image of the given ImageType
   */
  static getPrimaryImage(product: ProductView, imageType: string): Image {
    if (!product?.images) {
      return;
    }
    return product.images.find(image => image.typeID === imageType && image.primaryImage);
  }

  /**
   * Get product image based on image type and image view
   *
   * @param product   The Product for which to get the image
   * @param imageType The wanted ImageType
   * @param imageView The wanted ImageView
   * @returns         The matching product image
   */
  static getImageByImageTypeAndImageView(product: ProductView, imageType: string, imageView: string): Image {
    if (!product?.images) {
      return;
    }
    return product.images.find(image => image.typeID === imageType && image.viewID === imageView);
  }

  /**
   * Get all product ImageView ids matching image type
   *
   * @param product   The Product for which to get the image types
   * @param imageType The wanted ImageType
   * @returns         Array of available ImageView ids
   */
  static getImageViewIDs(product: ProductView, imageType: string): string[] {
    if (!product?.images) {
      return [];
    }
    return product.images
      .filter(image => image.typeID === imageType)
      .sort((a, b) => (a.primaryImage ? -1 : b.primaryImage ? 1 : 0))
      .map(image => image.viewID);
  }

  /**
   * check if a given product has a sufficient completeness level
   */
  static isSufficientlyLoaded(product: Product | ProductView, completenessLevel: ProductCompletenessLevel): boolean {
    return !!product && product.completenessLevel >= completenessLevel;
  }

  static isFailedLoading(product: Product | ProductView): boolean {
    return !!product && !!product.failed;
  }

  static isReadyForDisplay(product: Product | ProductView, completenessLevel: ProductCompletenessLevel) {
    return ProductHelper.isSufficientlyLoaded(product, completenessLevel) || ProductHelper.isFailedLoading(product);
  }

  /**
   * Check if product is a retail set
   */
  static isRetailSet(product: Partial<AllProductTypes>): product is ProductRetailSet {
    return product && product.type === 'RetailSet';
  }

  /**
   * Check if product is a master product
   */
  static isMasterProduct(product: Partial<AllProductTypes>): product is VariationProductMaster & ProductView {
    return product && product.type === 'VariationProductMaster';
  }

  /**
   * Check if product is a variation product
   */
  static isVariationProduct(product: Partial<AllProductTypes>): product is VariationProduct & ProductView {
    return product && product.type === 'VariationProduct';
  }

  /**
   * Check if product is a product bundle
   */
  static isProductBundle(product: Partial<AllProductTypes>): product is ProductBundle {
    return product && product.type === 'Bundle';
  }

  /**
   * Get product attributes by attribute group id.
   *
   * @param product           The Product for which to get the attributes
   * @param attributeGroupId  The attribute group id of the attributes to get
   * @returns                 The product attributes of the attribute group (if any)
   */
  static getAttributesOfGroup(product: ProductView, attributeGroupId: string): Attribute[] {
    if (product?.attributeGroups?.[attributeGroupId]?.attributes?.length > 0) {
      return product.attributeGroups[attributeGroupId].attributes;
    }
    return;
  }

  /**
   * Determines the set of common attribute names for the compare products.
   *
   * @param products List of products to be compared
   * @returns        A set of the common attribute names
   */
  static getCommonAttributeNames(products: ProductView[]): string[] {
    if (!products?.length) {
      return [];
    }
    const result = products.filter(x => !!x).map(product => product.attributes?.map(x => x.name));
    return intersection(...result);
  }

  /**
   * Get a product with only specific attributes. All attributes that are common between the compare products are filtered out.
   *
   * @param product         The product that should be stripped of its common attributes
   * @param visibleProducts List of products to be compared
   * @returns               A Product with specific attributes only compared to the common attributes
   */
  static getProductWithoutCommonAttributes(product: ProductView, visibleProducts: ProductView[]): ProductView {
    if (!product?.sku || !visibleProducts?.length) {
      return;
    }
    const common = ProductHelper.getCommonAttributeNames(visibleProducts);
    const attributes = product.attributes?.filter(att => !common.includes(att.name));
    return { ...product, attributes };
  }

  /**
   * Updates current product information with new product information considering completeness levels and dynamic product information
   *
   * @param currentProduct  The already available product information
   * @param newProduct      The new product information to update the existing information with
   * @returns               The updated product information
   */
  static updateProductInformation(
    currentProduct: Partial<AllProductTypes>,
    newProduct: Partial<AllProductTypes>
  ): AllProductTypes {
    // if there is no new product information return the current product information
    if (!newProduct) {
      return currentProduct as AllProductTypes;
    }
    // set the current product information as base or construct an empty product stub
    let product = currentProduct || { completenessLevel: 0 };
    // update the complete product information if the newProduct information
    // has a higher or equal completeness level than the product information
    if (!product.completenessLevel || newProduct.completenessLevel >= product.completenessLevel) {
      return newProduct as AllProductTypes;
    }
    // if the newProduct information has a lower completeness level merge attributes and
    // always update dynamic product information with the new product information (e.g. availability)
    product = {
      ...newProduct,
      ...product,
      // list of product properties that should be updated
      available: newProduct.available ?? product.available,
      availableStock: newProduct.availableStock ?? product.availableStock,
    };
    return product as AllProductTypes;
  }
}
