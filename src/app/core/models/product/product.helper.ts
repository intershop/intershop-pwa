import { intersection } from 'lodash-es';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Image } from 'ish-core/models/image/image.model';
import { PriceHelper } from 'ish-core/models/price/price.model';
import { VariationProductMasterView, VariationProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductBundle } from './product-bundle.model';
import { ProductRetailSet } from './product-retail-set.model';
import { VariationProductMaster } from './product-variation-master.model';
import { VariationProduct } from './product-variation.model';
import { Product } from './product.model';

export interface SkuQuantityType {
  sku: string;
  quantity: number;
}

export enum ProductCompletenessLevel {
  Detail = 3,
  List = 2,
}

export type AllProductTypes = Product | VariationProduct | VariationProductMaster | ProductBundle | ProductRetailSet;
export type AnyProductType = Product & VariationProduct & VariationProductMaster & ProductBundle & ProductRetailSet;

export type ProductPrices =
  | Partial<Pick<ProductRetailSet, 'minListPrice' | 'minSalePrice' | 'summedUpListPrice' | 'summedUpSalePrice'>>
  | Partial<Pick<VariationProductMaster, 'minListPrice' | 'minSalePrice' | 'maxListPrice' | 'maxSalePrice'>>
  | Partial<Pick<Product, 'salePrice' | 'listPrice'>>;

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
   * check if a given product has a sufficient completeness level
   */
  static isSufficientlyLoaded(product: Product, completenessLevel: ProductCompletenessLevel): boolean {
    return !!product && product.completenessLevel >= completenessLevel;
  }

  static isFailedLoading(product: Product): boolean {
    return !!product && !!product.failed;
  }

  static isReadyForDisplay(product: Product, completenessLevel: ProductCompletenessLevel) {
    return ProductHelper.isSufficientlyLoaded(product, completenessLevel) || ProductHelper.isFailedLoading(product);
  }

  /**
   * Check if product is a retail set
   */
  static isRetailSet(product: Product): product is ProductRetailSet {
    return product && product.type === 'RetailSet';
  }

  /**
   * Check if product is a master product
   */
  static isMasterProduct(product: Product): product is VariationProductMaster & VariationProductMasterView {
    return product && product.type === 'VariationProductMaster';
  }

  /**
   * Check if product is a variation product
   */
  static isVariationProduct(product: Partial<Product>): product is VariationProduct & VariationProductView {
    return product && product.type === 'VariationProduct';
  }

  static hasVariations(product: Product): product is VariationProductView | VariationProductMasterView {
    return (
      (ProductHelper.isVariationProduct(product) || ProductHelper.isMasterProduct(product)) &&
      !!product.variations().length
    );
  }

  /**
   * Check if product is a product bundle
   */
  static isProductBundle(product: Product): product is ProductBundle {
    return product && product.type === 'Bundle';
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

  static calculatePriceRange(products: Product[]): ProductPrices {
    if (!products || !products.length) {
      return {};
    } else if (products.length === 1) {
      return products[0];
    } else {
      return {
        minListPrice: products.map(p => p.listPrice).reduce(PriceHelper.min),
        minSalePrice: products.map(p => p.salePrice).reduce(PriceHelper.min),
        summedUpListPrice: products.map(p => p.listPrice).reduce(PriceHelper.sum),
        summedUpSalePrice: products.map(p => p.salePrice).reduce(PriceHelper.sum),
      };
    }
  }

  /**
   * Determines the set of common attribute names for the compare products.
   * @param products List of products to be compared
   * @returns        A set of the common attribute names
   */
  static getCommonAttributeNames(products: Product[]): string[] {
    if (!products || !products.length) {
      return [];
    }
    const result = products.filter(x => !!x).map(product => product.attributes.map(x => x.name));
    return intersection(...result);
  }

  /**
   * Get a product with only specific attributes. All attributes that are common between the compare products are filtered out.
   * @param product         The product that should be stripped of its common attributes
   * @param visibleProducts List of products to be compared
   * @returns               A Product with specific attributes only compared to the common attributes
   */
  static getProductWithoutCommonAttributes(product: Product, visibleProducts: Product[]): Product {
    if (!product || !product.sku || !visibleProducts || !visibleProducts.length) {
      return;
    }
    const common = ProductHelper.getCommonAttributeNames(visibleProducts);
    const attributes = product.attributes.filter(att => !common.includes(att.name));
    return { ...product, attributes };
  }
}
