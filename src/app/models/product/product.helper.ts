import { Attribute } from '../attribute/attribute.model';
import { Category } from '../category/category.model';
import { Image } from '../image/image.model';
import { Product } from './product.model';
import { ProductType } from './product.types';

export class ProductHelper {
  /**
   * Generate a product detail route with optional category context.
   * @param product   The Product to genereate the route for
   * @param category  The optional Category that should be used as context for the product route
   * @returns         Product route string
   */
  static generateProductRoute(product: Product, category?: Category): string {
    if (!(product && product.sku)) {
      return '/';
    }
    let productRoute = '/product/' + product.sku;
    const productSlug = ProductHelper.generateProductSlug(product);
    if (productSlug) {
      productRoute += '/' + productSlug;
    }

    if (category) {
      productRoute = '/category/' + category.uniqueId + productRoute;
    } else {
      // TODO: add defaultCategory to route once this information is available with the products REST call
    }
    return productRoute;
  }

  static generateProductSlug(product: Product) {
    return product && product.name ? product.name.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+$/g, '') : undefined;
  }

  /**
   * Get primary product image based on image type
   * @param product   The Product for which to get the primary image
   * @param imageType The wanted ImageType
   * @returns         The primary product image of the given ImageType
   */
  static getPrimaryImage(product: Product, imageType: string): Image {
    if (!(product && product.images)) {
      return undefined;
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
      return undefined;
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
  static getAttributeByAttributeName(product: Product, attributeName: string): Attribute {
    if (!(product && product.attributes)) {
      return undefined;
    }
    return product.attributes.find(attribute => attribute.name === attributeName);
  }
}
