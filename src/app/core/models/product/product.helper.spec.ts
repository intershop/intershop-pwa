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

  describe('updateProductInformation()', () => {
    let detailProduct: Product;
    let listProduct: Product;
    let stubProduct: Product;
    let stubProduct2: Product;

    beforeEach(() => {
      detailProduct = {
        sku: '110',
        completenessLevel: ProductCompletenessLevel.Detail,
        name: 'Detail Product',
        manufacturer: 'Detail Manufacturer',
        shortDescription: 'The best product',
        available: true,
      } as Product;
      listProduct = {
        sku: '110',
        completenessLevel: ProductCompletenessLevel.List,
        name: 'List Product',
        manufacturer: 'List Manufacturer',
        available: false,
      } as Product;
      stubProduct = {
        sku: '110',
        longDescription: 'additional info',
        completenessLevel: 0,
        name: 'Stub Product',
        available: false,
      } as Product;
      stubProduct2 = {
        sku: '110',
        completenessLevel: 0,
        name: 'Stub Product 2',
        available: true,
      } as Product;
    });

    it('should return current product information if no new product information is provided', () => {
      expect(ProductHelper.updateProductInformation(detailProduct, undefined)).toMatchInlineSnapshot(`
        Object {
          "available": true,
          "completenessLevel": 3,
          "manufacturer": "Detail Manufacturer",
          "name": "Detail Product",
          "shortDescription": "The best product",
          "sku": "110",
        }
      `);
    });

    it('should return new product information if no product information exists', () => {
      expect(ProductHelper.updateProductInformation(undefined, stubProduct)).toMatchInlineSnapshot(`
        Object {
          "available": false,
          "completenessLevel": 0,
          "longDescription": "additional info",
          "name": "Stub Product",
          "sku": "110",
        }
      `);
    });

    it('should return new product information if completeness level ist higher', () => {
      expect(ProductHelper.updateProductInformation(listProduct, detailProduct)).toMatchInlineSnapshot(`
        Object {
          "available": true,
          "completenessLevel": 3,
          "manufacturer": "Detail Manufacturer",
          "name": "Detail Product",
          "shortDescription": "The best product",
          "sku": "110",
        }
      `);
    });

    it('should return new product information if completeness level ist equal', () => {
      expect(ProductHelper.updateProductInformation(stubProduct, stubProduct2)).toMatchInlineSnapshot(`
        Object {
          "available": true,
          "completenessLevel": 0,
          "name": "Stub Product 2",
          "sku": "110",
        }
      `);
    });

    it('should return updated current product information if completeness level ist lower', () => {
      expect(ProductHelper.updateProductInformation(detailProduct, stubProduct)).toMatchInlineSnapshot(`
        Object {
          "available": false,
          "availableStock": undefined,
          "completenessLevel": 3,
          "longDescription": "additional info",
          "manufacturer": "Detail Manufacturer",
          "name": "Detail Product",
          "shortDescription": "The best product",
          "sku": "110",
        }
      `);
    });

    it('should return undefined if no current or new product information is provided', () => {
      expect(ProductHelper.updateProductInformation(undefined, undefined)).toMatchInlineSnapshot(`undefined`);
    });
  });
});
