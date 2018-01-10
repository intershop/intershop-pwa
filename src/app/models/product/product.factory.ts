import { AttributeFactory } from '../attribute/attribute.factory';
import { FactoryHelper } from '../factory-helper';
import { ImageFactory } from '../image/image.factory';
import { VariationProduct } from './product-variation.model';
import { ProductData } from './product.interface';
import { Product } from './product.model';


export class ProductFactory {

  static fromData(data: ProductData): Product {
    const product: Product = data.productMaster || data.mastered ? new VariationProduct() : new Product();

    FactoryHelper.primitiveMapping<ProductData, Product>(data, product);

    if (data.images) {
      product.images = data.images.map(image => ImageFactory.fromData(image));
    }
    if (data.attributes) {
      product.attributes = data.attributes.map(attribute => AttributeFactory.fromData(attribute));
    }
    if (product instanceof VariationProduct && data.variationAttributes) {
      product.variationAttributes = data.variationAttributes.map(variationAttribute => AttributeFactory.fromData(variationAttribute));
    }
    return product;
  }
}
