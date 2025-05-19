import { TestBed } from '@angular/core/testing';
import { anything, instance, mock, when } from 'ts-mockito';

import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueCategoryMapper } from 'ish-core/models/sparque-category/sparque-category.mapper';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';

import { SparqueSuggestions } from './sparque-suggestions.interface';
import { SparqueSuggestionsMapper } from './sparque-suggestions.mapper';

const categoryIds = ['cat1', 'cat2'];

const categoryTree = {
  nodes: { cat1: { name: 'cat1' } as Category, cat2: { name: 'cat2' } as Category },
  rootIds: ['cat1', 'cat2'],
  edges: {},
  categoryRefs: {},
};

const productSkus = ['sku1', 'sku2'];

const products: Partial<Product>[] = [
  {
    sku: 'sku1',
    name: 'Product 1',
    shortDescription: 'Product 1 shortDescription',
    available: true,
    type: 'Product',
    images: [],
    completenessLevel: 2,
  },
  {
    sku: 'sku2',
    name: 'Product 2',
    shortDescription: 'Product 2 shortDescription',
    available: true,
    type: 'Product',
    images: [],
    completenessLevel: 2,
  },
];

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
    when(sparqueProductMapper.fromSuggestionsData(anything())).thenReturn({ productSkus, products });
  });

  describe('fromData', () => {
    it('should map categories and products correctly', () => {
      const sparqueSuggestions: SparqueSuggestions = {} as SparqueSuggestions;
      const result = sparqueSuggestionsMapper.fromData(sparqueSuggestions);
      expect(result.suggestions.categories).toMatchInlineSnapshot(`
        [
          "cat1",
          "cat2",
        ]
      `);
      expect(result.categories).toMatchInlineSnapshot(`
        ├─ cat1
        └─ cat2

      `);
      expect(result.suggestions.products).toMatchInlineSnapshot(`
        [
          "sku1",
          "sku2",
        ]
      `);
      expect(result.products).toMatchInlineSnapshot(`
        [
          {
            "available": true,
            "completenessLevel": 2,
            "images": [],
            "name": "Product 1",
            "shortDescription": "Product 1 shortDescription",
            "sku": "sku1",
            "type": "Product",
          },
          {
            "available": true,
            "completenessLevel": 2,
            "images": [],
            "name": "Product 2",
            "shortDescription": "Product 2 shortDescription",
            "sku": "sku2",
            "type": "Product",
          },
        ]
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
      expect(result.suggestions.brands[0]).toMatchInlineSnapshot(`
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
      expect(result.suggestions.keywords).toMatchInlineSnapshot(`
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
      expect(result).toBeUndefined();
    });
  });
});
