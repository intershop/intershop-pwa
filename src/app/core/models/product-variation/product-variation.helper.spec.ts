import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationProduct, VariationProductMaster } from 'ish-core/models/product/product.model';

import { ProductVariationHelper } from './product-variation.helper';

const productVariations = [
  {
    sku: '222',
    productMasterSKU: 'M111',
    variableVariationAttributes: [
      { name: 'Attr 1', type: 'String', value: 'A', variationAttributeId: 'a1' },
      { name: 'Attr 2', type: 'String', value: 'A', variationAttributeId: 'a2' },
    ],
  },
  {
    sku: '333',
    productMasterSKU: 'M111',
    attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
    variableVariationAttributes: [
      { name: 'Attr 1', type: 'String', value: 'A', variationAttributeId: 'a1' },
      { name: 'Attr 2', type: 'String', value: 'B', variationAttributeId: 'a2' },
    ],
  },
  {
    sku: '444',
    productMasterSKU: 'M111',
    variableVariationAttributes: [
      { name: 'Attr 1', type: 'String', value: 'B', variationAttributeId: 'a1' },
      { name: 'Attr 2', type: 'String', value: 'A', variationAttributeId: 'a2' },
    ],
  },
  {
    sku: '555',
    productMasterSKU: 'M111',
    variableVariationAttributes: [
      { name: 'Attr 1', type: 'String', value: 'B', variationAttributeId: 'a1' },
      { name: 'Attr 2', type: 'String', value: 'B', variationAttributeId: 'a2' },
    ],
  },
  {
    sku: '666',
    productMasterSKU: 'M111',
    variableVariationAttributes: [
      { name: 'Attr 1', type: 'String', value: 'B', variationAttributeId: 'a1' },
      { name: 'Attr 2', type: 'String', value: 'C', variationAttributeId: 'a2' },
    ],
  },
] as VariationProduct[];

const productMaster = {
  sku: 'M111',
  variationAttributeValues: [
    { name: 'Attr 1', type: 'String', value: 'A', variationAttributeId: 'a1' },
    { name: 'Attr 1', type: 'String', value: 'B', variationAttributeId: 'a1' },
    { name: 'Attr 2', type: 'String', value: 'A', variationAttributeId: 'a2' },
    { name: 'Attr 2', type: 'String', value: 'B', variationAttributeId: 'a2' },
    { name: 'Attr 2', type: 'String', value: 'C', variationAttributeId: 'a2' },
  ],
} as VariationProductMaster;

const variationProductView = {
  ...productVariations[0],
  productMaster,
  variations: productVariations,
} as ProductView;

const masterProductView = {
  ...productMaster,
  variations: productVariations,
} as ProductView;

describe('Product Variation Helper', () => {
  describe('buildVariationOptionGroups', () => {
    it('should build variation option groups for variation product', () => {
      const expectedGroups = [
        {
          id: 'a1',
          label: 'Attr 1',
          options: [
            {
              label: 'A',
              value: 'A',
              type: 'a1',
              alternativeCombination: false,
              active: true,
            },
            {
              label: 'B',
              value: 'B',
              type: 'a1',
              alternativeCombination: false,
              active: false,
            },
          ],
        },
        {
          id: 'a2',
          label: 'Attr 2',
          options: [
            {
              label: 'A',
              value: 'A',
              type: 'a2',
              alternativeCombination: false,
              active: true,
            },
            {
              label: 'B',
              value: 'B',
              type: 'a2',
              alternativeCombination: false,
              active: false,
            },
            {
              label: 'C',
              value: 'C',
              type: 'a2',
              alternativeCombination: true,
              active: false,
            },
          ],
        },
      ];

      const result = ProductVariationHelper.buildVariationOptionGroups(variationProductView);
      expect(result).toEqual(expectedGroups);
    });
  });

  describe('findPossibleVariation', () => {
    it('should find perfect match when first attribute is changed', () => {
      expect(ProductVariationHelper.findPossibleVariation('a2', 'B', variationProductView)).toEqual('333');
    });

    it('should find perfect match when second attribute is changed', () => {
      expect(ProductVariationHelper.findPossibleVariation('a1', 'B', variationProductView)).toEqual('444');
    });

    it('should find variation match when second attribute is changed and no perfect match could be found', () => {
      expect(ProductVariationHelper.findPossibleVariation('a2', 'C', variationProductView)).toEqual('666');
    });

    it('should return original sku when impossible selection is selected', () => {
      expect(ProductVariationHelper.findPossibleVariation('a2', 'Z', variationProductView)).toEqual('222');
    });
  });

  describe('productVariationCount', () => {
    it('should return zero when no inputs are given', () => {
      expect(ProductVariationHelper.productVariationCount(undefined, undefined)).toEqual(0);
    });

    it('should use variation length when no filters are given', () => {
      expect(ProductVariationHelper.productVariationCount(masterProductView, undefined)).toEqual(5);
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

      expect(ProductVariationHelper.productVariationCount(masterProductView, filters)).toEqual(5);
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

      expect(ProductVariationHelper.productVariationCount(masterProductView, filters)).toEqual(2);
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

      expect(ProductVariationHelper.productVariationCount(masterProductView, filters)).toEqual(3);
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

      expect(ProductVariationHelper.productVariationCount(masterProductView, filters)).toEqual(1);
    });
  });
});
