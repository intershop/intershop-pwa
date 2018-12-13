import { Inject, Injectable } from '@angular/core';

import { ICM_BASE_URL } from 'ish-core/utils/state-transfer/factories';
import { ImageMapper } from '../image/image.mapper';
import { Price } from '../price/price.model';

import { VariationProductMaster } from './product-variation-master.model';
import { VariationProduct } from './product-variation.model';
import { ProductData, ProductDataStub } from './product.interface';
import { Product, ProductHelper, ProductType } from './product.model';

function filterPrice(price: Price): Price {
  if (price && price.currencyMnemonic && price.currencyMnemonic !== 'N/A') {
    return price;
  }
  return;
}

/**
 * check if attribute is available and return value, otherwise undefined
 */
function retrieveStubAttributeValue(data: ProductDataStub, attributeName: string) {
  const attribute = ProductHelper.getAttributeByAttributeName(data, attributeName);
  return !!attribute ? attribute.value : undefined;
}

/**
 * Product Mapper maps data of HTTP requests to model instances and vice versa.
 */
@Injectable({ providedIn: 'root' })
export class ProductMapper {
  constructor(@Inject(ICM_BASE_URL) public icmBaseURL, private imageMapper: ImageMapper) {}

  /**
   * construct a {@link Product} stub from data returned by link list responses with additional data
   */
  fromStubData(data: ProductDataStub): Product {
    const sku = retrieveStubAttributeValue(data, 'sku');
    if (!sku) {
      throw new Error('cannot construct product stub without SKU');
    }
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
      // TODO: will be supplied by REST API with ISREST-389
      inStock: retrieveStubAttributeValue(data, 'availability'),
      longDescription: undefined,
      // TODO: will be supplied by REST API with ISREST-401
      minOrderQuantity: 1,
      attributes: [],
      attributeGroups: data.attributeGroups,
      readyForShipmentMin: undefined,
      readyForShipmentMax: undefined,
      type: ProductType.Product,
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
