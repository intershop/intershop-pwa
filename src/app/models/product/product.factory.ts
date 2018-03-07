import { AttributeFactory } from '../attribute/attribute.factory';
import { FactoryHelper } from '../factory-helper';
import { ImageFactory } from '../image/image.factory';
import { PriceFactory } from '../price/price.factory';
import { VariationProductMaster } from './product-variation-master.model';
import { VariationProduct } from './product-variation.model';
import { ProductData } from './product.interface';
import { Product } from './product.model';


export class ProductFactory {

  static fromData(data: ProductData): Product {
    const product: Product = data.productMaster ? new VariationProductMaster(data.sku) : (data.mastered ? new VariationProduct(data.sku, data.productMasterSKU) : new Product(data.sku));

    FactoryHelper.primitiveMapping<ProductData, Product>(data, product);

    if (data.images) {
      product.images = data.images.map(image => ImageFactory.fromData(image));
    }
    if (data.variationAttributeValues) {
      product.attributes = data.variationAttributeValues.map(attribute => AttributeFactory.fromData(attribute));
    }
    if (product instanceof VariationProduct && data.variationAttributeValues) {
      product.variationAttributes = data.variationAttributeValues.map(variationAttribute => AttributeFactory.fromData(variationAttribute));
    }
    if (data.listPrice) {
      product.listPrice = PriceFactory.fromData(data.listPrice);
    }
    if (data.salePrice) {
      product.salePrice = PriceFactory.fromData(data.salePrice);
    }
    if (data.attributes) {
      product.attributes = data.attributes.map(attribute => AttributeFactory.fromData(attribute));
    }
    product.name = data.productName;
    return product;
  }
}
