import { Injectable } from '@angular/core';

import { AttributeHelper } from '../attribute/attribute.helper';
import { CategoryData } from '../category/category.interface';
import { CategoryMapper } from '../category/category.mapper';
import { ImageMapper } from '../image/image.mapper';
import { Link } from '../link/link.model';
import { Price } from '../price/price.model';

import { VariationProduct } from './product-variation.model';
import { AllProductTypes } from './product.helper';
import { ProductData, ProductDataStub, ProductVariationLink } from './product.interface';
import { Product } from './product.model';

function filterPrice(price: Price): Price {
  if (price && price.currency && price.currency !== 'N/A') {
    return price;
  }
  return;
}

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
 * Product Mapper maps data of HTTP requests to model instances and vice versa.
 */
@Injectable({ providedIn: 'root' })
export class ProductMapper {
  constructor(private imageMapper: ImageMapper, private categoryMapper: CategoryMapper) {}

  fromVariationLink(link: ProductVariationLink, productMasterSKU: string): Partial<VariationProduct> {
    return {
      sku: link.uri.split('/products/')[1],
      variableVariationAttributes: link.variableVariationAttributeValues,
      name: link.title,
      productMasterSKU,
      shortDescription: link.description,
      type: 'VariationProduct',
      attributes: link.attributes || [],
      completenessLevel: 1,
      failed: false,
    };
  }

  /**
   * construct a {@link Product} stub from data returned by link list responses with additional data
   */
  fromStubData(data: ProductDataStub): AllProductTypes {
    const sku = retrieveStubAttributeValue<string>(data, 'sku');
    if (!sku) {
      throw new Error('cannot construct product stub without SKU');
    }
    const productCategory = retrieveStubAttributeValue<CategoryData>(data, 'defaultCategory');

    const minOrderQuantityValue = retrieveStubAttributeValue<{ value: number }>(data, 'minOrderQuantity');
    const minOrderQuantity = minOrderQuantityValue ? minOrderQuantityValue.value : undefined;

    const promotionsValue = retrieveStubAttributeValue<{ elements: Link[] }>(data, 'promotions');
    const promotionLinks = promotionsValue && promotionsValue.elements ? promotionsValue.elements : [];

    const mastered = retrieveStubAttributeValue<boolean>(data, 'mastered');
    const productMaster = retrieveStubAttributeValue<boolean>(data, 'productMaster');
    const productMasterSKU = retrieveStubAttributeValue<string>(data, 'productMasterSKU');

    const product: Product = {
      shortDescription: data.description,
      name: data.title,
      sku,
      listPrice: filterPrice(retrieveStubAttributeValue(data, 'listPrice')),
      salePrice: filterPrice(retrieveStubAttributeValue(data, 'salePrice')),
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
      availability: retrieveStubAttributeValue(data, 'availability'),
      inStock: retrieveStubAttributeValue(data, 'inStock'),
      longDescription: undefined,
      minOrderQuantity,
      attributes: [],
      attributeGroups: data.attributeGroups,
      readyForShipmentMin: undefined,
      readyForShipmentMax: undefined,
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
      availability: data.availability,
      inStock: data.inStock,
      minOrderQuantity: data.minOrderQuantity || 1,
      maxOrderQuantity: data.maxOrderQuantity || 100,
      attributes: data.attributes,
      attributeGroups: data.attributeGroups,
      images: this.imageMapper.fromImages(data.images),
      listPrice: filterPrice(data.listPrice),
      salePrice: filterPrice(data.salePrice),
      manufacturer: data.manufacturer,
      readyForShipmentMin: data.readyForShipmentMin,
      readyForShipmentMax: data.readyForShipmentMax,
      sku: data.sku,
      defaultCategoryId: data.defaultCategory
        ? this.categoryMapper.fromDataSingle(data.defaultCategory).uniqueId
        : undefined,
      promotionIds: mapPromotionIds(data.promotions),
      completenessLevel: 3,
      failed: false,
    };

    if (data.productMaster) {
      return {
        ...product,
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
    } else {
      return product;
    }
  }
}
