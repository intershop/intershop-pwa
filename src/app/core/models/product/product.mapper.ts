import { Injectable } from '@angular/core';

import { CategoryData } from '../category/category.interface';
import { CategoryMapper } from '../category/category.mapper';
import { ImageMapper } from '../image/image.mapper';
import { Price } from '../price/price.model';

import { VariationProductMaster } from './product-variation-master.model';
import { VariationProduct } from './product-variation.model';
import { ProductData, ProductDataStub } from './product.interface';
import { Product, ProductHelper, ProductType } from './product.model';

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
  const attribute = ProductHelper.getAttributeByAttributeName(data, attributeName);
  return attribute ? (attribute.value as T) : undefined;
}

/**
 * Product Mapper maps data of HTTP requests to model instances and vice versa.
 */
@Injectable({ providedIn: 'root' })
export class ProductMapper {
  constructor(private imageMapper: ImageMapper, private categoryMapper: CategoryMapper) {}

  /**
   * construct a {@link Product} stub from data returned by link list responses with additional data
   */
  fromStubData(data: ProductDataStub): Product {
    const sku = retrieveStubAttributeValue<string>(data, 'sku');
    if (!sku) {
      throw new Error('cannot construct product stub without SKU');
    }
    const productCategory = retrieveStubAttributeValue<CategoryData>(data, 'defaultCategory');

    const minOrderQuantityValue = retrieveStubAttributeValue<{ value: number }>(data, 'minOrderQuantity');
    const minOrderQuantity = minOrderQuantityValue ? minOrderQuantityValue.value : undefined;

    return {
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
      type: ProductType.Product,
      defaultCategoryId: productCategory ? this.categoryMapper.fromDataSingle(productCategory).uniqueId : undefined,
    };
  }

  /**
   * map API Response to fully qualified {@link Product}s
   */
  fromData(data: ProductData): Product | VariationProductMaster | VariationProduct {
    const product: Product = {
      type: ProductType.Product,
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
    };

    if (data.productMaster) {
      return {
        ...product,
        variationProducts: [],
        type: ProductType.VariationProductMaster,
      };
    } else if (data.mastered) {
      return {
        ...product,
        productMasterSKU: data.productMasterSKU,
        type: ProductType.VariationProduct,
      };
    } else {
      return product;
    }
  }
}
