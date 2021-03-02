import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';

import { ProductDataStub } from './product.interface';
import { Product, ProductCompletenessLevel, ProductHelper } from './product.model';

describe('Product Helper', () => {
  describe('image', () => {
    let product: Product;
    beforeEach(() => {
      product = { sku: 'sku' } as Product;
      product.images = [
        {
          name: 'front S',
          type: 'Image',
          imageActualHeight: 110,
          imageActualWidth: 110,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'S',
          primaryImage: true,
        },
        {
          name: 'front S',
          type: 'Image',
          imageActualHeight: 110,
          imageActualWidth: 110,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'S',
          primaryImage: false,
        },
        {
          name: 'front L',
          type: 'Image',
          imageActualHeight: 500,
          imageActualWidth: 500,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'L',
          primaryImage: true,
        },
        {
          name: 'side L',
          type: 'Image',
          imageActualHeight: 500,
          imageActualWidth: 500,
          viewID: 'side',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'L',
          primaryImage: false,
        },
      ];
    });

    describe('getPrimaryImage()', () => {
      it('should return primary image when called with image type as L(Large size)', () => {
        expect(ProductHelper.getPrimaryImage(product, 'L').primaryImage).toBeTruthy();
      });

      it('should return undefined  when called with invalid image type', () => {
        expect(ProductHelper.getPrimaryImage(product, 'W')).toBeUndefined();
      });

      it('should return undefined when images are not available', () => {
        product.images = [];
        expect(ProductHelper.getPrimaryImage(product, 'L')).toBeUndefined();
      });

      it('should return undefined when images is not defined', () => {
        product = { sku: 'sku' } as Product;
        expect(ProductHelper.getPrimaryImage(product, 'L')).toBeUndefined();
      });
    });

    describe('getImageByImageTypeAndImageView()', () => {
      it('should return image when called with image type as L(Large size) and image view as front', () => {
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'L', 'front')).toEqual(product.images[2]);
      });

      it('should return undefined when called with invalid image type and invalid image view', () => {
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'W', 'left')).toBeUndefined();
      });

      it('should return undefined when images are not available', () => {
        product.images = [];
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'L', 'front')).toBeUndefined();
      });

      it('should return undefined when images is not defined', () => {
        product = { sku: 'sku' } as Product;
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'L', 'front')).toBeUndefined();
      });
    });

    describe('getImageViewIDs()', () => {
      it('should return list of image viewIDs when called with image type as L(Large size)', () => {
        expect(ProductHelper.getImageViewIDs(product, 'L').length).toBeGreaterThan(0);
      });

      it('should return empty list when called with invalid image type', () => {
        expect(ProductHelper.getImageViewIDs(product, 'W')).toBeEmpty();
      });

      it('should return empty list when images are not available', () => {
        product.images = [];
        expect(ProductHelper.getImageViewIDs(product, 'L')).toBeEmpty();
      });

      it('should return empty list when images is not defined', () => {
        product = { sku: 'sku' } as Product;
        expect(ProductHelper.getImageViewIDs(product, 'L')).toBeEmpty();
      });
    });
  });

  describe('isMasterProduct()', () => {
    it.each([
      [false, { type: 'Product' }],
      [false, { type: 'VariationProduct' }],
      [true, { type: 'VariationProductMaster' }],
    ])(`should return %s when supplying '%j'`, (expected, product: Product) => {
      expect(ProductHelper.isMasterProduct(product)).toEqual(expected);
    });
  });

  describe('get attributes', () => {
    it('should return attribute when attribute is defined', () => {
      const productData = {
        attributes: [{ name: 'sku', type: 'String', value: '01234567' }],
        description: '',
      } as ProductDataStub;
      expect(AttributeHelper.getAttributeValueByAttributeName<string>(productData.attributes, 'sku')).toBe('01234567');
    });

    it('should return attribute of attribute group when attribute group is defined', () => {
      const attributeGroup = {
        attributes: [{ name: 'sale', type: 'String', value: 'sale' }],
      } as AttributeGroup;
      const product = {
        name: 'FakeProduct',
        sku: 'sku',
        attributeGroups: {
          [AttributeGroupTypes.ProductLabelAttributes]: attributeGroup,
        } as { [id: string]: AttributeGroup },
      } as Product;
      const attributes = ProductHelper.getAttributesOfGroup(product, AttributeGroupTypes.ProductLabelAttributes);
      expect(attributes).not.toBeEmpty();
      expect(attributes[0].name).toBe('sale');
    });
  });

  describe('isFailedLoading()', () => {
    it.each([
      [false, undefined],
      [false, {}],
      [false, { failed: false }],
      [true, { failed: true }],
    ])(`should return %s when supplying product '%j'`, (expected, product: Product) => {
      expect(ProductHelper.isFailedLoading(product)).toEqual(expected);
    });
  });

  describe('isSufficientlyLoaded()', () => {
    it.each([
      [false, undefined],
      [false, { completenessLevel: 0 }],
      [true, { completenessLevel: ProductCompletenessLevel.List }],
      [true, { completenessLevel: ProductCompletenessLevel.Detail }],
    ])(`should return %s when supplying product '%j'`, (expected, product: Product) => {
      expect(ProductHelper.isSufficientlyLoaded(product, ProductCompletenessLevel.List)).toEqual(expected);
    });
  });

  describe('isReadyForDisplay()', () => {
    it.each([
      [false, undefined],
      [true, { completenessLevel: ProductCompletenessLevel.List }],
      [true, { completenessLevel: ProductCompletenessLevel.Detail }],
      [true, { failed: true }],
    ])(`should return %s when supplying product '%j'`, (expected, product: Product) => {
      expect(ProductHelper.isReadyForDisplay(product, ProductCompletenessLevel.List)).toEqual(expected);
    });
  });

  describe('calculatePriceRange()', () => {
    it('should return empty object when no products are supplied', () => {
      expect(ProductHelper.calculatePriceRange(undefined)).toBeEmpty();
      expect(ProductHelper.calculatePriceRange([])).toBeEmpty();
    });

    it('should return the single object if only one element is supplied', () => {
      const product = { salePrice: { value: 1 } } as Product;
      expect(ProductHelper.calculatePriceRange([product])).toEqual(product);
    });

    it('should calculate a range when multiple elements are supplied', () => {
      const product1 = {
        salePrice: { value: 1, currency: 'EUR' },
        listPrice: { value: 2, currency: 'EUR' },
      } as Product;
      const product2 = {
        salePrice: { value: 3, currency: 'EUR' },
        listPrice: { value: 4, currency: 'EUR' },
      } as Product;
      const product3 = {
        salePrice: { value: 5, currency: 'EUR' },
        listPrice: { value: 6, currency: 'EUR' },
      } as Product;
      expect(ProductHelper.calculatePriceRange([product1, product2, product3])).toMatchInlineSnapshot(`
        Object {
          "minListPrice": Object {
            "currency": "EUR",
            "type": undefined,
            "value": 2,
          },
          "minSalePrice": Object {
            "currency": "EUR",
            "type": undefined,
            "value": 1,
          },
          "summedUpListPrice": Object {
            "currency": "EUR",
            "type": undefined,
            "value": 12,
          },
          "summedUpSalePrice": Object {
            "currency": "EUR",
            "type": undefined,
            "value": 9,
          },
        }
      `);
    });
  });

  describe('compare', () => {
    let product: Product;
    let compareProduct1: Product;
    let compareProduct2: Product;

    beforeEach(() => {
      product = { sku: '110', available: true } as Product;
      product.attributes = [
        {
          name: 'Optical zoom',
        },
        {
          name: 'Focal length (35mm film equivalent)',
        },
        {
          name: 'Image formats supported',
        },
      ] as Attribute[];
      compareProduct1 = {
        ...product,
        sku: '111',
        attributes: [
          {
            name: 'Optical zoom',
          },
        ] as Attribute[],
      };
      compareProduct2 = {
        ...product,
        sku: '112',
        attributes: [
          {
            name: 'Optical zoom',
          },
          {
            name: 'Image formats supported',
          },
        ] as Attribute[],
      };
    });

    describe('getCommonAttributeNames()', () => {
      it('should return empty object when no products are supplied', () => {
        expect(ProductHelper.getCommonAttributeNames(undefined)).toBeEmpty();
        expect(ProductHelper.getCommonAttributeNames([])).toBeEmpty();
      });

      it('should return all attribute names of product if only one element is supplied', () => {
        expect(ProductHelper.getCommonAttributeNames([product])).toMatchInlineSnapshot(`
          Array [
            "Optical zoom",
            "Focal length (35mm film equivalent)",
            "Image formats supported",
          ]
        `);
      });
      it('should return the correct set of attributes for different list of products', () => {
        expect(ProductHelper.getCommonAttributeNames([product, compareProduct1])).toMatchInlineSnapshot(`
          Array [
            "Optical zoom",
          ]
        `);
        expect(ProductHelper.getCommonAttributeNames([product, compareProduct2])).toMatchInlineSnapshot(`
          Array [
            "Optical zoom",
            "Image formats supported",
          ]
        `);
        expect(ProductHelper.getCommonAttributeNames([product, compareProduct1, compareProduct2]))
          .toMatchInlineSnapshot(`
          Array [
            "Optical zoom",
          ]
        `);
      });
    });

    describe('getProductWithoutCommonAttributes()', () => {
      it('should return undefined when no product or no compare products are supplied', () => {
        expect(ProductHelper.getProductWithoutCommonAttributes(undefined, undefined)).toBeUndefined();
      });

      it('should return product with correct filtered attributes for different list of compare products', () => {
        expect(ProductHelper.getProductWithoutCommonAttributes(product, [compareProduct1])).toMatchInlineSnapshot(`
          Object {
            "attributes": Array [
              Object {
                "name": "Focal length (35mm film equivalent)",
              },
              Object {
                "name": "Image formats supported",
              },
            ],
            "available": true,
            "sku": "110",
          }
        `);
        expect(ProductHelper.getProductWithoutCommonAttributes(product, [compareProduct2])).toMatchInlineSnapshot(`
          Object {
            "attributes": Array [
              Object {
                "name": "Focal length (35mm film equivalent)",
              },
            ],
            "available": true,
            "sku": "110",
          }
        `);
        expect(ProductHelper.getProductWithoutCommonAttributes(product, [compareProduct1, compareProduct2]))
          .toMatchInlineSnapshot(`
          Object {
            "attributes": Array [
              Object {
                "name": "Focal length (35mm film equivalent)",
              },
              Object {
                "name": "Image formats supported",
              },
            ],
            "available": true,
            "sku": "110",
          }
        `);
      });
    });
  });
});
