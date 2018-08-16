import { Attribute } from '../attribute/attribute.model';

import { VariationProduct } from './product-variation.model';
import { ProductData, ProductDataStub } from './product.interface';
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

  describe('fromStubData', () => {
    it('should throw an error when stub data has no sku attribute', () => {
      expect(() => ProductMapper.fromStubData({} as ProductDataStub)).toThrowErrorMatchingSnapshot();
    });

    it('should construct a stub when supplied with an API response', () => {
      const stub = ProductMapper.fromStubData({
        attributes: [{ name: 'sku', value: 'productSKU', type: 'String' }],
        title: 'productName',
        description: 'productDescription',
      });
      expect(stub).toBeTruthy();
      expect(stub.name).toEqual('productName');
      expect(stub.shortDescription).toEqual('productDescription');
      expect(stub.sku).toEqual('productSKU');
    });

    it('should construct a stub when supplied with a complex API response', () => {
      const stub = ProductMapper.fromStubData({
        attributes: [
          { name: 'sku', value: '7912057' },
          { name: 'image', value: '/assets/product_img/a.jpg' },
          {
            name: 'listPrice',
            value: { currencyMnemonic: 'USD', type: 'Money', value: 132.24 },
          },
          {
            name: 'salePrice',
            value: { currencyMnemonic: 'USD', type: 'Money', value: 132.24 },
          },
          { name: 'availability', value: true },
          { name: 'manufacturer', value: 'Kodak' },
        ] as Attribute[],
        description: 'EasyShare M552, 14MP, 6.858 cm (2.7 ") LCD, 4x, 28mm, HD 720p, Black',
        title: 'Kodak M series EasyShare M552',
      });

      expect(stub).toMatchSnapshot();
    });
  });
});
