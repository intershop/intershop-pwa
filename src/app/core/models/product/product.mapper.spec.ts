import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { anything, spy, verify } from 'ts-mockito';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { ImageMapper } from 'ish-core/models/image/image.mapper';
import { Link } from 'ish-core/models/link/link.model';
import { getICMBaseURL } from 'ish-core/store/core/configuration';

import { ProductData, ProductDataStub } from './product.interface';
import { ProductMapper } from './product.mapper';
import { Product, ProductHelper, VariationProductMaster } from './product.model';

describe('Product Mapper', () => {
  let productMapper: ProductMapper;
  let imageMapper: ImageMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getICMBaseURL, value: 'http://www.example.org' }] })],
    });
    productMapper = TestBed.inject(ProductMapper);
    imageMapper = spy(TestBed.inject(ImageMapper));
  });

  describe('fromData', () => {
    it(`should return Product when getting a ProductData`, () => {
      const product: Product = productMapper.fromData({ sku: '1' } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type).toEqual('Product');
      verify(imageMapper.fromImages(anything())).once();
    });

    it(`should return VariationProduct when getting a ProductData with mastered = true`, () => {
      const product: Product = productMapper.fromData({
        sku: '1',
        mastered: true,
        productMasterSKU: '2',
      } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type).toEqual('VariationProduct');
      expect(ProductHelper.isMasterProduct(product)).toBeFalsy();
      verify(imageMapper.fromImages(anything())).once();
    });

    it(`should return VariationProductMaster when getting a ProductData with productMaster = true`, () => {
      const product: Product = productMapper.fromData({ sku: '1', productMaster: true } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type).toEqual('VariationProductMaster');
      expect(ProductHelper.isMasterProduct(product)).toBeTruthy();
    });

    it(`should return VariationProductMaster with variationAttributes when getting a ProductData with productMaster = true`, () => {
      const product: Product = productMapper.fromData({
        sku: '1',
        productMaster: true,
        variationAttributeValues: [],
      } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type).toEqual('VariationProductMaster');
      expect(ProductHelper.isMasterProduct(product)).toBeTruthy();
      expect((product as VariationProductMaster).variationAttributeValues).toBeEmpty();
    });

    it(`should return Product with variationAttributes when getting a ProductData with productMaster = false`, () => {
      const product: Product = productMapper.fromData({
        sku: '1',
        productMaster: false,
        variableVariationAttributes: [],
      } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type).toEqual('Product');
      expect(ProductHelper.isMasterProduct(product)).toBeFalsy();
      expect((product as VariationProductMaster).variationAttributeValues).toBeFalsy();
    });

    it('should return ProductBundle when getting a ProductData with productBundle = true', () => {
      const product: Product = productMapper.fromData({
        sku: '1',
        productBundle: true,
      } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type).toEqual('Bundle');
      expect(ProductHelper.isProductBundle(product)).toBeTrue();
    });

    it('should return ProductBundle when getting a ProductData with producttype contains "BUNDLE"', () => {
      const product: Product = productMapper.fromData({
        sku: '1',
        productTypes: ['BUNDLE'],
      } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type).toEqual('Bundle');
      expect(ProductHelper.isProductBundle(product)).toBeTrue();
    });

    it('should return ProductRetailSet when getting a ProductData with retailSet = true', () => {
      const product: Product = productMapper.fromData({
        sku: '1',
        retailSet: true,
      } as ProductData);
      expect(product).toBeTruthy();
      expect(product.type).toEqual('RetailSet');
      expect(ProductHelper.isRetailSet(product)).toBeTrue();
    });

    it('should return attributes or detailed product attributes when PRODUCT_DETAIL_ATTRIBUTES enabled', () => {
      const p1: Product = productMapper.fromData({
        sku: '1',
        attributes: [{ name: 'Graphics', type: 'String', value: 'NVIDIA Quadro K2200' }],
      } as ProductData);
      const p2: Product = productMapper.fromData(({
        sku: '1',
        attributes: [{ name: 'Graphics', type: 'String', value: 'NVIDIA Quadro K2200' }],
        attributeGroups: {
          PRODUCT_DETAIL_ATTRIBUTES: {
            attributes: [{ name: 'Grafikkarte', type: 'String', value: 'NVIDIA Quadro K2200' }],
          },
        },
      } as unknown) as ProductData);
      expect(p1).toBeTruthy();
      expect(p1.attributes).toEqual([{ name: 'Graphics', type: 'String', value: 'NVIDIA Quadro K2200' }]);
      expect(p2).toBeTruthy();
      expect(p2.attributes).toEqual([{ name: 'Grafikkarte', type: 'String', value: 'NVIDIA Quadro K2200' }]);
    });

    describe('available', () => {
      it.each([
        [undefined, undefined, false],
        [false, undefined, false],
        [true, undefined, true],
        [undefined, false, false],
        [false, false, false],
        [true, false, false],
        [true, true, true],
      ])('should calculate availability=%s inStock=%s -> %s', (availability, inStock, expected) => {
        const data = { availability, inStock } as ProductData;
        expect(productMapper.fromData(data).available).toEqual(expected);
      });
    });
  });

  describe('fromStubData', () => {
    it('should throw an error when stub data has no sku attribute', () => {
      expect(() => productMapper.fromStubData({} as ProductDataStub)).toThrowErrorMatchingInlineSnapshot(
        `"cannot construct product stub without SKU"`
      );
    });

    it('should construct a stub when supplied with an API response', () => {
      const stub = productMapper.fromStubData({
        attributes: [{ name: 'sku', value: 'productSKU', type: 'String' }],
        title: 'productName',
        description: 'productDescription',
        attributeGroup: {
          name: 'attrGroup',
          attributes: [
            {
              name: 'attrName',
              type: 'Boolean',
              value: true,
            },
          ],
        },
      });
      expect(stub).toBeTruthy();
      expect(stub.name).toEqual('productName');
      expect(stub.shortDescription).toEqual('productDescription');
      expect(stub.sku).toEqual('productSKU');
      verify(imageMapper.fromImages(anything())).once();
    });

    it('should construct a stub when supplied with a complex API response', () => {
      const stub = productMapper.fromStubData({
        attributes: [
          { name: 'sku', value: '7912057' },
          { name: 'image', value: '/assets/product_img/a.jpg' },
          {
            name: 'listPrice',
            value: { currency: 'USD', type: 'Money', value: 132.24 },
          },
          {
            name: 'salePrice',
            value: { currency: 'USD', type: 'Money', value: 132.24 },
          },
          { name: 'availability', value: true },
          { name: 'manufacturer', value: 'Kodak' },
          { name: 'minOrderQuantity', value: { value: 5 } },
          { name: 'packingUnit', value: 'pcs.' },
          { name: 'inStock', value: false },
        ] as Attribute[],
        description: 'EasyShare M552, 14MP, 6.858 cm (2.7 ") LCD, 4x, 28mm, HD 720p, Black',
        title: 'Kodak M series EasyShare M552',
        attributeGroup: {
          name: 'attrGroup',
          attributes: [
            {
              name: 'attrName',
              type: 'Boolean',
              value: true,
            },
          ],
        },
      });

      expect(stub).toMatchSnapshot();
    });

    describe('available', () => {
      it.each([
        [undefined, undefined, false],
        [false, undefined, false],
        [true, undefined, true],
        [undefined, false, false],
        [false, false, false],
        [true, false, false],
        [true, true, true],
      ])('should calculate availability=%s inStock=%s -> %s', (availability, inStock, expected) => {
        const data = {
          attributes: [
            { name: 'sku', value: '123' },
            { name: 'availability', value: availability },
            { name: 'inStock', value: inStock },
          ],
        } as ProductDataStub;
        expect(productMapper.fromStubData(data).available).toEqual(expected);
      });
    });
  });

  describe('fromProductBundleData', () => {
    it('should map bundle stubs to sku and quantity', () => {
      expect(
        productMapper.fromProductBundleData([
          {
            attributes: [{ name: 'quantity', value: { value: 1 } }],
            uri: 'inSPIRED-inTRONICS-Site/-/products/201807191',
          },
          {
            attributes: [{ name: 'quantity', value: { value: 2 } }],
            uri: 'inSPIRED-inTRONICS-Site/-/products/201807192',
          },
          {
            attributes: [{ name: 'quantity', value: { value: 1 } }],
            uri: 'inSPIRED-inTRONICS-Site/-/products/201807193',
          },
        ] as Link[])
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "quantity": 1,
            "sku": "201807191",
          },
          Object {
            "quantity": 2,
            "sku": "201807192",
          },
          Object {
            "quantity": 1,
            "sku": "201807193",
          },
        ]
      `);
    });
  });

  describe('parseSKUfromURI()', () => {
    it.each([
      'site/products/123',
      'products/123',
      'site/products/123?test=dummy',
      'products/123?test=dummy',
      'site/products;spgid=dfds/123',
      'products;spgid=dfds/123',
      'site/products;spgid=dfds/123?test=dummy',
      'products;spgid=dfds/123?test=dummy',
      'site/products;spgid=dfds/123?test=dummy&test2=dummy',
      'products;spgid=dfds/123?test=dummy&test2=dummy',
    ])(`should parse correct sku when given '%s'`, uri => {
      expect(ProductMapper.parseSKUfromURI(uri)).toEqual('123');
    });
  });

  it('should find default variation for master product', () => {
    const variations = [
      { uri: 'inSPIRED-inTRONICS-Site/-/products/111' },
      {
        attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
        uri: 'inSPIRED-inTRONICS-Site/-/products/222',
      },
      { uri: 'inSPIRED-inTRONICS-Site/-/products/333' },
    ] as Link[];

    const result = ProductMapper.findDefaultVariation(variations);
    expect(result).toBe('222');
  });
});
