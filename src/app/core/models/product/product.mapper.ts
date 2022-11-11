import { Injectable } from '@angular/core';
import { flatten } from 'lodash-es';

import { AttachmentMapper } from 'ish-core/models/attachment/attachment.mapper';
import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { CategoryData } from 'ish-core/models/category/category.interface';
import { CategoryMapper } from 'ish-core/models/category/category.mapper';
import { ImageMapper } from 'ish-core/models/image/image.mapper';
import { Link } from 'ish-core/models/link/link.model';
import { VariationAttributeMapper } from 'ish-core/models/product-variation/variation-attribute.mapper';
import { SeoAttributesMapper } from 'ish-core/models/seo-attributes/seo-attributes.mapper';

import { SkuQuantityType } from './product.helper';
import { ProductData, ProductDataStub, ProductVariationLink } from './product.interface';
import { AllProductTypes, Product, VariationProduct, VariationProductMaster } from './product.model';

/**
 * check if attribute is available and return value, otherwise undefined
 */
function retrieveStubAttributeValue<T>(data: ProductDataStub, attributeName: string) {
  return data ? AttributeHelper.getAttributeValueByAttributeName<T>(data.attributes, attributeName) : undefined;
}

/**
 * maps promotion links data to a string array of promotion ids
 */
function mapPromotionIds(data: Link[]): string[] {
  return data ? data.map(promotionLink => promotionLink.itemId) : [];
}

/**
 * maps an attribute group and its attribute data to the same format as it is used in a single product call
 */
function mapAttributeGroups(data: ProductDataStub): { [id: string]: AttributeGroup } {
  return { [data.attributeGroup.name]: { attributes: data.attributeGroup.attributes } };
}

/**
 * Product Mapper maps data of HTTP requests to model instances and vice versa.
 */
@Injectable({ providedIn: 'root' })
export class ProductMapper {
  constructor(
    private imageMapper: ImageMapper,
    private attachmentMapper: AttachmentMapper,
    private categoryMapper: CategoryMapper,
    private variationAttributeMapper: VariationAttributeMapper
  ) {}

  static parseSkuFromURI(uri: string): string {
    const match = /products[^\/]*\/([^\?]*)/.exec(uri);
    if (match) {
      return match[1];
    } else {
      console.warn(`could not find sku in uri '${uri}'`);
      return;
    }
  }

  static findDefaultVariation(variationLinks: Link[]): string {
    const defaultVariation = variationLinks.find(variation =>
      AttributeHelper.getAttributeValueByAttributeName<boolean>(variation.attributes, 'defaultVariation')
    );

    return defaultVariation ? ProductMapper.parseSkuFromURI(defaultVariation.uri) : undefined;
  }

  static constructMasterStub(sku: string, variations: Partial<VariationProduct>[]): Partial<VariationProductMaster> {
    return (
      variations?.length && {
        type: 'VariationProductMaster',
        sku,
        completenessLevel: 0,
        variationAttributeValues: flatten(variations.map(v => v.variableVariationAttributes)).filter(
          (val, idx, arr) =>
            arr.findIndex(el => el.variationAttributeId === val.variationAttributeId && el.value === val.value) === idx
        ),
      }
    );
  }

  fromLink(link: Link): Partial<Product> {
    return {
      sku: ProductMapper.parseSkuFromURI(link.uri),
      name: link.title,
      shortDescription: link.description,
      type: 'Product',
      completenessLevel: 1,
    };
  }

  fromVariationLink(link: ProductVariationLink, productMasterSKU: string): Partial<VariationProduct> {
    return {
      ...this.fromLink(link),
      variableVariationAttributes: this.variationAttributeMapper.fromData(
        link.variableVariationAttributeValuesExtended
      ),
      productMasterSKU,
      type: 'VariationProduct',
      failed: false,
    };
  }

  fromRetailSetLink(link: Link): Partial<Product> {
    return {
      sku: ProductMapper.parseSkuFromURI(link.uri),
      name: link.title,
      shortDescription: link.description,
      completenessLevel: 1,
    };
  }
  /**
   * construct a {@link Product} stub from data returned by link list responses with additional data
   */
  fromStubData(data: ProductDataStub): Partial<AllProductTypes> {
    const sku = retrieveStubAttributeValue<string>(data, 'sku');
    if (!sku) {
      throw new Error('cannot construct product stub without SKU');
    }
    const productCategory = retrieveStubAttributeValue<CategoryData>(data, 'defaultCategory');

    const promotionLinks = retrieveStubAttributeValue<{ elements: Link[] }>(data, 'promotions')?.elements ?? [];

    const product: Partial<Product> = {
      shortDescription: data.description,
      name: data.title,
      sku,
      images: this.imageMapper.fromImageUrl(retrieveStubAttributeValue(data, 'image')),
      manufacturer: retrieveStubAttributeValue(data, 'manufacturer'),
      available: this.calculateAvailable(
        retrieveStubAttributeValue(data, 'availability'),
        retrieveStubAttributeValue(data, 'inStock')
      ),
      longDescription: undefined,
      minOrderQuantity: retrieveStubAttributeValue<{ value: number }>(data, 'minOrderQuantity')?.value,
      maxOrderQuantity: retrieveStubAttributeValue<{ value: number }>(data, 'maxOrderQuantity')?.value,
      stepOrderQuantity: retrieveStubAttributeValue<{ value: number }>(data, 'stepOrderQuantity')?.value,
      packingUnit: retrieveStubAttributeValue(data, 'packingUnit'),
      attributeGroups: data.attributeGroup && mapAttributeGroups(data),
      readyForShipmentMin: undefined,
      readyForShipmentMax: undefined,
      roundedAverageRating: +retrieveStubAttributeValue<string>(data, 'roundedAverageRating') || 0,
      type: 'Product',
      defaultCategoryId: productCategory ? this.categoryMapper.fromDataSingle(productCategory).uniqueId : undefined,
      promotionIds: mapPromotionIds(promotionLinks),
      completenessLevel: 2,
      failed: false,
    };
    return this.appendProductTypeForStubData(data, product);
  }
  /**
   * map API Response to fully qualified {@link Product}s
   */
  fromData(data: ProductData): AllProductTypes {
    const product: Product = {
      type: 'Product',
      name: data.productName,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      available: this.calculateAvailable(data.availability, data.inStock),
      minOrderQuantity: data.minOrderQuantity,
      maxOrderQuantity: data.maxOrderQuantity,
      stepOrderQuantity: data.stepOrderQuantity,
      packingUnit: data.packingUnit,
      availableStock: data.availableStock,
      attributes: data.attributeGroups?.PRODUCT_DETAIL_ATTRIBUTES?.attributes || data.attributes || [],
      attributeGroups: data.attributeGroups,
      attachments: this.attachmentMapper.fromAttachments(data.attachments),
      images: this.imageMapper.fromImages(data.images),
      manufacturer: data.manufacturer,
      readyForShipmentMin: data.readyForShipmentMin,
      readyForShipmentMax: data.readyForShipmentMax,
      roundedAverageRating: +data.roundedAverageRating || 0,
      numberOfReviews: data.numberOfReviews || 0,
      sku: data.sku,
      defaultCategoryId: data.defaultCategory
        ? this.categoryMapper.fromDataSingle(data.defaultCategory).uniqueId
        : undefined,
      promotionIds: mapPromotionIds(data.promotions),
      completenessLevel: 3,
      failed: false,
      seoAttributes: SeoAttributesMapper.fromData(data.seoAttributes),
    };

    return this.appendProductTypeForData(data, product);
  }

  private calculateAvailable(availability: boolean, inStock: boolean) {
    return !!availability && (inStock !== undefined ? inStock : true);
  }

  /**
   * map product bundle API Response to a link / quantity type
   */
  fromProductBundleData(links: Link[]): SkuQuantityType[] {
    return links.map(link => ({
      sku: ProductMapper.parseSkuFromURI(link.uri),
      quantity: AttributeHelper.getAttributeValueByAttributeName<{ value: number }>(link.attributes, 'quantity').value,
    }));
  }

  private appendProductTypeForStubData(data: ProductDataStub, product: Partial<Product>): Partial<AllProductTypes> {
    const mastered = retrieveStubAttributeValue<boolean>(data, 'mastered');
    const productMaster = retrieveStubAttributeValue<boolean>(data, 'productMaster');
    const productMasterSKU = retrieveStubAttributeValue<string>(data, 'productMasterSKU');
    const retailSet = retrieveStubAttributeValue<boolean>(data, 'retailSet');

    if (productMaster) {
      return {
        ...product,
        type: 'VariationProductMaster',
      };
    } else if (mastered) {
      return {
        ...product,
        productMasterSKU,
        type: 'VariationProduct',
      };
    } else if (retailSet) {
      return {
        ...product,
        type: 'RetailSet',
      };
    } else {
      return product;
    }
  }

  private appendProductTypeForData(data: ProductData, product: Product): AllProductTypes {
    if (data.productMaster) {
      return {
        ...product,
        variationAttributeValues: this.variationAttributeMapper.fromMasterData(data.variationAttributeValuesExtended),
        type: 'VariationProductMaster',
      };
    } else if (data.mastered) {
      return {
        ...product,
        productMasterSKU: data.productMasterSKU,
        variableVariationAttributes: this.variationAttributeMapper.fromData(data.variationAttributeValuesExtended),
        type: 'VariationProduct',
      };
    } else if (data.productTypes?.includes('BUNDLE') || data.productBundle) {
      return {
        ...product,
        type: 'Bundle',
      };
    } else if (data.retailSet) {
      return {
        ...product,
        type: 'RetailSet',
      };
    } else {
      return product;
    }
  }
}
