import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationProduct, VariationProductMaster } from 'ish-core/models/product/product.model';

import { ProductVariationHelper } from './product-variation.helper';

const productVariations = [
  {
    sku: '222',
    productMasterSKU: 'M111',
    variableVariationAttributes: [
      { name: 'Attr 1', value: 'A', variationAttributeId: 'a1' },
      { name: 'Attr 2', value: 'A', variationAttributeId: 'a2' },
      { name: 'Attr 3', value: { value: 3, unit: 'm' }, variationAttributeId: 'a3' },
    ],
  },
  {
    sku: '333',
    productMasterSKU: 'M111',
    attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
    variableVariationAttributes: [
      { name: 'Attr 1', value: 'A', variationAttributeId: 'a1' },
      { name: 'Attr 2', value: 'B', variationAttributeId: 'a2' },
      { name: 'Attr 3', value: { value: 1, unit: 'm' }, variationAttributeId: 'a3' },
    ],
  },
  {
    sku: '444',
    productMasterSKU: 'M111',
    variableVariationAttributes: [
      { name: 'Attr 1', value: 'B', variationAttributeId: 'a1' },
      { name: 'Attr 2', value: 'A', variationAttributeId: 'a2' },
      { name: 'Attr 3', value: { value: 2, unit: 'm' }, variationAttributeId: 'a3' },
    ],
  },
  {
    sku: '555',
    productMasterSKU: 'M111',
    variableVariationAttributes: [
      { name: 'Attr 1', value: 'B', variationAttributeId: 'a1' },
      { name: 'Attr 2', value: 'B', variationAttributeId: 'a2' },
      { name: 'Attr 3', value: { value: 3, unit: 'm' }, variationAttributeId: 'a3' },
    ],
  },
  {
    sku: '666',
    productMasterSKU: 'M111',
    variableVariationAttributes: [
      { name: 'Attr 1', value: 'B', variationAttributeId: 'a1' },
      { name: 'Attr 2', value: 'C', variationAttributeId: 'a2' },
      { name: 'Attr 3', value: { value: 3, unit: 'm' }, variationAttributeId: 'a3' },
    ],
  },
] as VariationProduct[];

const productMaster = {
  sku: 'M111',
  variationAttributeValues: [
    { name: 'Attr 1', value: 'A', variationAttributeId: 'a1' },
    { name: 'Attr 1', value: 'B', variationAttributeId: 'a1' },
    { name: 'Attr 2', value: 'A', variationAttributeId: 'a2' },
    { name: 'Attr 2', value: 'B', variationAttributeId: 'a2' },
    { name: 'Attr 2', value: 'C', variationAttributeId: 'a2' },
    { name: 'Attr 3', value: '1', variationAttributeId: 'a3' },
    { name: 'Attr 3', value: '2', variationAttributeId: 'a3' },
    { name: 'Attr 3', value: '3', variationAttributeId: 'a3' },
  ],
} as VariationProductMaster;

const variationProduct = {
  ...productVariations[0],
  productMaster,
} as ProductView;

describe('Product Variation Helper', () => {
  describe('buildVariationOptionGroups', () => {
    it('should build variation option groups for variation product', () => {
      const result = ProductVariationHelper.buildVariationOptionGroups(variationProduct, productVariations);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "attributeType": undefined,
            "id": "a1",
            "label": "Attr 1",
            "options": [
              {
                "active": true,
                "alternativeCombination": false,
                "label": "A",
                "metaData": undefined,
                "type": "a1",
                "value": "A",
              },
              {
                "active": false,
                "alternativeCombination": true,
                "label": "B",
                "metaData": undefined,
                "type": "a1",
                "value": "B",
              },
            ],
          },
          {
            "attributeType": undefined,
            "id": "a2",
            "label": "Attr 2",
            "options": [
              {
                "active": true,
                "alternativeCombination": false,
                "label": "A",
                "metaData": undefined,
                "type": "a2",
                "value": "A",
              },
              {
                "active": false,
                "alternativeCombination": true,
                "label": "B",
                "metaData": undefined,
                "type": "a2",
                "value": "B",
              },
              {
                "active": false,
                "alternativeCombination": true,
                "label": "C",
                "metaData": undefined,
                "type": "a2",
                "value": "C",
              },
            ],
          },
          {
            "attributeType": undefined,
            "id": "a3",
            "label": "Attr 3",
            "options": [
              {
                "active": false,
                "alternativeCombination": true,
                "label": "1",
                "metaData": undefined,
                "type": "a3",
                "value": "1",
              },
              {
                "active": false,
                "alternativeCombination": true,
                "label": "2",
                "metaData": undefined,
                "type": "a3",
                "value": "2",
              },
              {
                "active": true,
                "alternativeCombination": false,
                "label": "3",
                "metaData": undefined,
                "type": "a3",
                "value": "3",
              },
            ],
          },
        ]
      `);
    });
  });

  describe('findPossibleVariation', () => {
    it('should find perfect match when first attribute is changed', () => {
      expect(ProductVariationHelper.findPossibleVariation('a2', 'B', variationProduct, productVariations)).toEqual(
        '333'
      );
    });

    it('should find perfect match when second attribute is changed', () => {
      expect(ProductVariationHelper.findPossibleVariation('a1', 'B', variationProduct, productVariations)).toEqual(
        '444'
      );
    });

    it('should find variation match when second attribute is changed and no perfect match could be found', () => {
      expect(ProductVariationHelper.findPossibleVariation('a2', 'C', variationProduct, productVariations)).toEqual(
        '666'
      );
    });

    it('should return original sku when impossible selection is selected', () => {
      expect(ProductVariationHelper.findPossibleVariation('a2', 'Z', variationProduct, productVariations)).toEqual(
        '222'
      );
    });
  });

  describe('productVariationCount', () => {
    it('should return zero when no inputs are given', () => {
      expect(ProductVariationHelper.productVariationCount(undefined, undefined)).toEqual(0);
    });

    it('should use variation length when no filters are given', () => {
      expect(ProductVariationHelper.productVariationCount(productVariations, undefined)).toEqual(5);
    });

    it('should ignore irrelevant selections when counting', () => {
      const filters = {
        filter: [
          {
            id: 'xyz',
            facets: [{ selected: true, name: 'xyz=foobar' }],
          },
        ],
      } as FilterNavigation;

      expect(ProductVariationHelper.productVariationCount(productVariations, filters)).toEqual(5);
    });

    it('should filter for products matching single selected attributes', () => {
      const filters = {
        filter: [
          {
            id: 'a1',
            facets: [
              { selected: true, name: 'a1=A' },
              { selected: false, name: 'a1=B' },
            ],
          },
          {
            id: 'xyz',
            facets: [{ selected: true, name: 'xyz=foobar' }],
          },
        ],
      } as FilterNavigation;

      expect(ProductVariationHelper.productVariationCount(productVariations, filters)).toEqual(2);
    });

    it('should filter for products matching complex value attributes', () => {
      const filters = {
        filter: [
          {
            id: 'a1',
            facets: [{ selected: true, name: 'a3=3' }],
          },
        ],
      } as FilterNavigation;

      expect(ProductVariationHelper.productVariationCount(productVariations, filters)).toEqual(3);
    });

    it('should filter for products matching multiple selected attributes', () => {
      const filters = {
        filter: [
          {
            id: 'a2',
            facets: [
              { selected: true, name: 'a2=A' },
              { selected: true, name: 'a2=C' },
            ],
          },
        ],
      } as FilterNavigation;

      expect(ProductVariationHelper.productVariationCount(productVariations, filters)).toEqual(3);
    });

    it('should filter for products matching multiple selected attributes over multiple facets', () => {
      const filters = {
        filter: [
          {
            id: 'a1',
            facets: [{ selected: true, name: 'a1=B' }],
          },
          {
            id: 'a2',
            facets: [{ selected: true, name: 'a2=B' }],
          },
        ],
      } as FilterNavigation;

      expect(ProductVariationHelper.productVariationCount(productVariations, filters)).toEqual(1);
    });
  });
});
