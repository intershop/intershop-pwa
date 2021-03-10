import { Injectable } from '@angular/core';
import { flatten } from 'lodash-es';

import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { CategoryData } from 'ish-core/models/category/category.interface';
import { CategoryMapper } from 'ish-core/models/category/category.mapper';
import { ImageMapper } from 'ish-core/models/image/image.mapper';
import { Link } from 'ish-core/models/link/link.model';
import { PriceMapper } from 'ish-core/models/price/price.mapper';
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
  constructor(private imageMapper: ImageMapper, private categoryMapper: CategoryMapper) {}

  static parseSKUfromURI(uri: string): string {
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

    return defaultVariation ? ProductMapper.parseSKUfromURI(defaultVariation.uri) : undefined;
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
      sku: ProductMapper.parseSKUfromURI(link.uri),
      name: link.title,
      shortDescription: link.description,
      type: 'Product',
      completenessLevel: 1,
    };
  }

  fromVariationLink(link: ProductVariationLink, productMasterSKU: string): Partial<VariationProduct> {
    return {
      ...this.fromLink(link),
      variableVariationAttributes: link.variableVariationAttributeValues,
      productMasterSKU,
      type: 'VariationProduct',
      failed: false,
    };
  }

  fromRetailSetLink(link: Link): Partial<Product> {
    return {
      sku: ProductMapper.parseSKUfromURI(link.uri),
      name: link.title,
      shortDescription: link.description,
      completenessLevel: 1,
    };
  }

  private calculateAvailable(availability: boolean, inStock: boolean) {
    return !!availability && (inStock !== undefined ? inStock : true);
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

    const mastered = retrieveStubAttributeValue<boolean>(data, 'mastered');
    const productMaster = retrieveStubAttributeValue<boolean>(data, 'productMaster');
    const productMasterSKU = retrieveStubAttributeValue<string>(data, 'productMasterSKU');
    const retailSet = retrieveStubAttributeValue<boolean>(data, 'retailSet');

    const product: Partial<Product> = {
      shortDescription: data.description,
      name: data.title,
      sku,
      listPrice: PriceMapper.fromData(retrieveStubAttributeValue(data, 'listPrice')),
      salePrice: PriceMapper.fromData(retrieveStubAttributeValue(data, 'salePrice')),
      images: this.imageMapper.fromImages([
        {
          effectiveUrl: retrieveStubAttributeValue(data, 'image'),
          name: 'front M',
          primaryImage: true,
          type: 'Image',
          typeID: 'M',
          viewID: 'front',
          imageActualHeight: undefined,
          imageActualWidth: undefined,
        },
        {
          effectiveUrl: retrieveStubAttributeValue(data, 'image'),
          name: 'front S',
          primaryImage: true,
          type: 'Image',
          typeID: 'S',
          viewID: 'front',
          imageActualHeight: undefined,
          imageActualWidth: undefined,
        },
      ]),
      manufacturer: retrieveStubAttributeValue(data, 'manufacturer'),
      available: this.calculateAvailable(
        retrieveStubAttributeValue(data, 'availability'),
        retrieveStubAttributeValue(data, 'inStock')
      ),
      longDescription: undefined,
      minOrderQuantity: retrieveStubAttributeValue<{ value: number }>(data, 'minOrderQuantity')?.value || 1,
      maxOrderQuantity: retrieveStubAttributeValue<{ value: number }>(data, 'maxOrderQuantity')?.value || 100,
      stepOrderQuantity: retrieveStubAttributeValue<{ value: number }>(data, 'stepOrderQuantity')?.value || 1,
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
      minOrderQuantity: data.minOrderQuantity || 1,
      maxOrderQuantity: data.maxOrderQuantity || 100,
      stepOrderQuantity: data.stepOrderQuantity || 1,
      packingUnit: data.packingUnit,
      availableStock: data.availableStock,
      attributes:
        (data.attributeGroups &&
          data.attributeGroups.PRODUCT_DETAIL_ATTRIBUTES &&
          data.attributeGroups.PRODUCT_DETAIL_ATTRIBUTES.attributes) ||
        data.attributes,
      attributeGroups: data.attributeGroups,
      images: this.imageMapper.fromImages(data.images),
      listPrice: PriceMapper.fromData(data.listPrice),
      salePrice: PriceMapper.fromData(data.salePrice),
      manufacturer: data.manufacturer,
      readyForShipmentMin: data.readyForShipmentMin,
      readyForShipmentMax: data.readyForShipmentMax,
      roundedAverageRating: +data.roundedAverageRating || 0,
      sku: data.sku,
      defaultCategoryId: data.defaultCategory
        ? this.categoryMapper.fromDataSingle(data.defaultCategory).uniqueId
        : undefined,
      promotionIds: mapPromotionIds(data.promotions),
      completenessLevel: 3,
      failed: false,
      seoAttributes: SeoAttributesMapper.fromData(data.seoAttributes),
    };

    if (data.productMaster) {
      return {
        ...product,
        minListPrice: PriceMapper.fromData(data.minListPrice),
        minSalePrice: PriceMapper.fromData(data.minSalePrice),
        maxListPrice: PriceMapper.fromData(data.maxListPrice),
        maxSalePrice: PriceMapper.fromData(data.maxSalePrice),
        variationAttributeValues: data.variationAttributeValues,
        type: 'VariationProductMaster',
      };
    } else if (data.mastered) {
      return {
        ...product,
        productMasterSKU: data.productMasterSKU,
        variableVariationAttributes: data.variableVariationAttributes,
        type: 'VariationProduct',
      };
    } else if ((data.productTypes && data.productTypes.includes('BUNDLE')) || data.productBundle) {
      return {
        ...product,
        type: 'Bundle',
      };
    } else if (data.retailSet) {
      return {
        ...product,
        type: 'RetailSet',
        minListPrice: PriceMapper.fromData(data.minListPrice),
        minSalePrice: PriceMapper.fromData(data.minSalePrice),
        summedUpListPrice: PriceMapper.fromData(data.summedUpListPrice),
        summedUpSalePrice: PriceMapper.fromData(data.summedUpSalePrice),
      };
    } else {
      return product;
    }
  }

  fromProductBundleData(links: Link[]): SkuQuantityType[] {
    return links.map(link => ({
      sku: ProductMapper.parseSKUfromURI(link.uri),
      quantity: AttributeHelper.getAttributeValueByAttributeName<{ value: number }>(link.attributes, 'quantity').value,
    }));
  }
}
