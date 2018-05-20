import { VariationProduct } from './product-variation.model';
import { ProductData } from './product.interface';
import { ProductMapper } from './product.mapper';
import { Product, ProductHelper, ProductType } from './product.model';

describe('Product Mapper', () => {
  describe('fromData', () => {
    it(`should return Product when getting a ProductData`, () => {
      const product: Product = ProductMapper.fromData({ sku: '1' } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type === ProductType.Product).toBeTruthy();
      expect(product.type === ProductType.VariationProduct).toBeFalsy();
    });

    it(`should return VariationProduct when getting a ProductData with mastered = true`, () => {
      const product: Product = ProductMapper.fromData({
        sku: '1',
        mastered: true,
        productMasterSKU: '2',
      } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type === ProductType.VariationProduct).toBeTruthy();
      expect(ProductHelper.isMasterProduct(product)).toBeFalsy();
    });

    it(`should return VariationProductMaster when getting a ProductData with productMaster = true`, () => {
      const product: Product = ProductMapper.fromData({ sku: '1', productMaster: true } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type === ProductType.VariationProductMaster).toBeTruthy();
      expect(ProductHelper.isMasterProduct(product)).toBeTruthy();
    });

    it(`should return VariationProductMaster with variationAttributes when getting a ProductData with productMaster = true`, () => {
      const product: Product = ProductMapper.fromData({
        sku: '1',
        productMaster: true,
        variableVariationAttributes: [],
      } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type === ProductType.VariationProductMaster).toBeTruthy();
      expect(ProductHelper.isMasterProduct(product)).toBeTruthy();
      expect((product as VariationProduct).variationAttributes).toBeFalsy();
    });

    it(`should return Product without variationAttributes when getting a ProductData with productMaster = false`, () => {
      const product: Product = ProductMapper.fromData({
        sku: '1',
        productMaster: false,
        variableVariationAttributes: [],
      } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type === ProductType.Product).toBeTruthy();
      expect(product.type === ProductType.VariationProduct).toBeFalsy();
      expect(ProductHelper.isMasterProduct(product)).toBeFalsy();
      expect((product as VariationProduct).variationAttributes).toBeFalsy();
    });
  });
});
