import { mergeObjectsMutably } from '../../utils/merge-objects';
import { VariationProductMaster } from './product-variation-master.model';
import { VariationProduct } from './product-variation.model';
import { ProductData } from './product.interface';
import { Product, ProductType } from './product.model';

export class ProductMapper {

  static fromData(data: ProductData): Product | VariationProductMaster | VariationProduct {

    const product: Product = {
      type: ProductType.Product,
      name: data.productName,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      availability: data.availability,
      inStock: data.inStock,
      minOrderQuantity: data.minOrderQuantity,
      // maxOrderQuantity: data.maxOrderQuantity,
      attributes: data.attributes,
      images: data.images,
      listPrice: data.listPrice,
      salePrice: data.salePrice,
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
