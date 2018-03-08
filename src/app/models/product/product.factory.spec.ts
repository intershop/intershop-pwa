import { VariationProductMaster } from './product-variation-master.model';
import { VariationProduct } from './product-variation.model';
import { ProductFactory } from './product.factory';
import { ProductData } from './product.interface';
import { Product } from './product.model';

describe('ProductFactory', () => {
  describe('fromData', () => {
    it(`should return Product when getting a ProductData`, () => {
      const product: Product = ProductFactory.fromData({ sku: '1' } as ProductData);
      expect(product).toBeTruthy();
      expect(product instanceof Product).toBeTruthy();
      expect(product instanceof VariationProduct).toBeFalsy();
    });
    it(`should return VariationProduct when getting a ProductData with mastered = true`, () => {
      const product: Product = ProductFactory.fromData({ sku: '1', mastered: true, productMasterSKU: '2' } as ProductData);
      expect(product).toBeTruthy();
      expect(product instanceof VariationProduct).toBeTruthy();
    });
    it(`should return VariationProductMaster when getting a ProductData with productMaster = true`, () => {
      const product: Product = ProductFactory.fromData({ sku: '1', productMaster: true } as ProductData);
      expect(product).toBeTruthy();
      expect(product instanceof VariationProductMaster).toBeTruthy();
    });
    it(`should return VariationProductMaster with variationAttributes when getting a ProductData with productMaster = true`, () => {
      const product: Product = ProductFactory.fromData({ sku: '1', productMaster: true, variableVariationAttributes: [] } as ProductData);
      expect(product).toBeTruthy();
      expect(product instanceof VariationProductMaster).toBeTruthy();
      expect((product as VariationProduct).variationAttributes).toBeFalsy();
    });
    it(`should return Product without variationAttributes when getting a ProductData with productMaster = false`, () => {
      const product: Product = ProductFactory.fromData({ sku: '1', productMaster: false, variableVariationAttributes: [] } as ProductData);
      expect(product).toBeTruthy();
      expect(product instanceof Product).toBeTruthy();
      expect(product instanceof VariationProduct).toBeFalsy();
      expect((product as VariationProduct).variationAttributes).toBeFalsy();
    });
  });
});
