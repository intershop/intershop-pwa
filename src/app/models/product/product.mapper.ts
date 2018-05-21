import { mergeObjectsMutably } from '../../utils/merge-objects';
import { Price } from '../price/price.model';
import { VariationProductMaster } from './product-variation-master.model';
import { VariationProduct } from './product-variation.model';
import { ProductData, ProductDataStub } from './product.interface';
import { Product, ProductHelper, ProductType } from './product.model';

function filterPrice(price: Price): Price {
  if (price && price.currencyMnemonic && price.currencyMnemonic !== 'N/A') {
    return price;
  }
  return undefined;
}

function retrieveStubAttributeValue(data: ProductDataStub, attributeName: string) {
  const attribute = ProductHelper.getAttributeByAttributeName(data, attributeName);
  return !!attribute ? attribute.value : undefined;
}

export class ProductMapper {
  static fromStubData(data: ProductDataStub) {
    const productStub: Product = {
      shortDescription: data.description,
      name: data.title,
      sku: retrieveStubAttributeValue(data, 'sku'),
      listPrice: filterPrice(retrieveStubAttributeValue(data, 'listPrice')),
      salePrice: filterPrice(retrieveStubAttributeValue(data, 'salePrice')),
      images: [
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
      ],
      manufacturer: retrieveStubAttributeValue(data, 'manufacturer'),
      availability: retrieveStubAttributeValue(data, 'availability'),
      inStock: retrieveStubAttributeValue(data, 'availability'),
      longDescription: undefined,
      minOrderQuantity: undefined,
      attributes: [],
      readyForShipmentMin: undefined,
      readyForShipmentMax: undefined,
      type: ProductType.Product,
    };
    return productStub;
  }

  static fromData(data: ProductData): Product | VariationProductMaster | VariationProduct {
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
      images: data.images,
      listPrice: filterPrice(data.listPrice),
      salePrice: filterPrice(data.salePrice),
      manufacturer: data.manufacturer,
      readyForShipmentMin: data.readyForShipmentMin,
      readyForShipmentMax: data.readyForShipmentMax,
      sku: data.sku,
    };

    if (data.productMaster) {
      const productMaster: VariationProductMaster = {
        ...product,
        variationProducts: [],
        type: ProductType.VariationProductMaster,
      };
      return productMaster;
    } else if (data.mastered) {
      const variationProduct: VariationProduct = {
        ...product,
        productMasterSKU: data.productMasterSKU,
        type: ProductType.VariationProduct,
      };
      return variationProduct;
    } else {
      return product;
    }
  }

  static updateImmutably(original: Product, change: Product): Product {
    return mergeObjectsMutably({ sku: original.sku } as Product, ['sku'], original, change);
  }
}
