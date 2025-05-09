import { TestBed } from '@angular/core/testing';
import { anything, instance, mock, when } from 'ts-mockito';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueCategoryMapper } from 'ish-core/models/sparque-category/sparque-category.mapper';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { Suggestions } from 'ish-core/models/suggestions/suggestions.model';

import { SparqueSuggestions } from './sparque-suggestions.interface';
import { SparqueSuggestionsMapper } from './sparque-suggestions.mapper';

const attributes = [{ name: 'Color', value: 'Red' }];

const sparqueProduct = {
  name: 'Product 1',
  shortDescription: 'Short description',
  longDescription: 'Long description',
  manufacturer: 'Manufacturer',
  images: [],
  attributes,
  sku: 'SKU1',
  defaultcategoryId: 'cat1',
  offers: [
    {
      priceIncVat: 100,
      priceExclVat: 80,
      currency: 'USD',
    },
  ],
} as SparqueProduct;

const product = {
  name: sparqueProduct.name,
  shortDescription: sparqueProduct.shortDescription,
  longDescription: sparqueProduct.longDescription,
  available: true,
  manufacturer: sparqueProduct.manufacturer,
  images: anything(),
  attributes,
  sku: sparqueProduct.sku,
  defaultCategoryId: sparqueProduct.defaultcategoryId,
  completenessLevel: 0,
  maxOrderQuantity: anything(),
  minOrderQuantity: anything(),
  stepQuantity: anything(),
  roundedAverageRating: anything(),
  numberOfReviews: anything(),
  readyForShipmentMin: anything(),
  readyForShipmentMax: anything(),
  packingUnit: anything(),
  type: anything(),
  promotionIds: anything(),
  failed: false,
} as Product;

const categoryIds = ['cat1', 'cat2'];

const categoryTree = {
  nodes: { cat1: { name: 'cat1' } as Category, cat2: { name: 'cat2' } as Category },
  rootIds: ['cat1', 'cat2'],
  edges: {},
  categoryRefs: {},
};

describe('Sparque Suggestions Mapper', () => {
  let sparqueSuggestionsMapper: SparqueSuggestionsMapper;
  const sparqueProductMapper = mock(SparqueProductMapper);
  const sparqueCategoryMapper = mock(SparqueCategoryMapper);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueCategoryMapper, useFactory: () => instance(sparqueCategoryMapper) },
        { provide: SparqueProductMapper, useFactory: () => instance(sparqueProductMapper) },
      ],
    });
    sparqueSuggestionsMapper = TestBed.inject(SparqueSuggestionsMapper);
    when(sparqueCategoryMapper.fromSuggestionsData(anything())).thenReturn({ categoryIds, categoryTree });
    when(sparqueProductMapper.mapProducts(anything())).thenReturn([product]);
  });

  describe('fromData', () => {
    it('should map products correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [sparqueProduct],
        categories: [],
        brands: [],
        keywordSuggestions: [],
      };

      const result = sparqueSuggestionsMapper.fromData(sparqueSuggestions);
      const suggestions: Suggestions = result[0];
      expect(suggestions.products).toHaveLength(1);
      expect(suggestions.products[0].name).toBe(sparqueProduct.name);
      expect(suggestions.products[0].shortDescription).toBe(sparqueProduct.shortDescription);
      expect(suggestions.products[0].longDescription).toBe(sparqueProduct.longDescription);
      expect(suggestions.products[0].manufacturer).toBe(sparqueProduct.manufacturer);
      expect(suggestions.products[0].attributes).toHaveLength(1);
      expect(suggestions.products[0].attributes[0].name).toBe(sparqueProduct.attributes[0].name);
      expect(suggestions.products[0].attributes[0].value).toBe(sparqueProduct.attributes[0].value);
      expect(suggestions.products[0].sku).toBe(sparqueProduct.sku);
      expect(suggestions.products[0].defaultCategoryId).toBe(sparqueProduct.defaultcategoryId);
    });

    it('should map categories correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {} as SparqueSuggestions;
      const result = sparqueSuggestionsMapper.fromData(sparqueSuggestions);
      const suggestions: Suggestions = result[0];
      const categoryTree: CategoryTree = result[1];
      expect(suggestions.categories).toMatchInlineSnapshot(`
        [
          "cat1",
          "cat2",
        ]
      `);
      expect(categoryTree).toMatchInlineSnapshot(`
        ├─ cat1
        └─ cat2

      `);
    });

    it('should map brands correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [],
        brands: [
          {
            brandName: 'Brand 1',
            totalCount: 5,
          },
        ],
        keywordSuggestions: [],
      };

      const result = sparqueSuggestionsMapper.fromData(sparqueSuggestions);
      const suggestions: Suggestions = result[0];
      expect(suggestions.brands[0]).toMatchInlineSnapshot(`
        {
          "brandName": "Brand 1",
          "totalCount": 5,
        }
      `);
    });

    it('should map keyword suggestions correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {
        products: [],
        categories: [],
        brands: [],
        keywordSuggestions: [{ keyword: 'keyword1' }, { keyword: 'keyword2' }],
      };

      const result = sparqueSuggestionsMapper.fromData(sparqueSuggestions);
      const suggestions: Suggestions = result[0];
      expect(suggestions.keywords).toMatchInlineSnapshot(`
        [
          {
            "keyword": "keyword1",
          },
          {
            "keyword": "keyword2",
          },
        ]
      `);
    });

    it('should return empty object for undefined input', () => {
      const result = sparqueSuggestionsMapper.fromData(undefined);
      const suggestions: Suggestions = result[0];
      expect(suggestions).toMatchInlineSnapshot(`undefined`);
    });
  });
});
