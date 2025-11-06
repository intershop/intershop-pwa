import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Product } from 'ish-core/models/product/product.model';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { SparqueFixedFacetGroup, SparqueSearch, SparqueSortingOption } from './sparque-search.interface';
import { SparqueSearchMapper } from './sparque-search.mapper';

const searchParams: URLFormParams = { searchTerm: ['fancyProduct'] };

const sortings: SparqueSortingOption[] = [
  { identifier: 'price', title: 'Price' },
  { identifier: 'name', title: 'Name' },
];

const facets: SparqueFixedFacetGroup[] = [
  {
    id: 'color',
    title: 'Color',
    options: [
      {
        id: 'option_Id1',
        identifier: 'option_identifier1',
        score: 1,
        value: 'value1',
        localizedNames: {
          'en-US': 'Red',
          'de-DE': 'Rot',
        },
      },
      {
        id: 'option_Id2',
        identifier: 'option_identifier2',
        score: 10,
        value: 'value2',
        localizedNames: {
          'en-US': 'Blue',
          'de-DE': 'Blau',
        },
      },
    ],
  },
  {
    id: 'category',
    title: 'Category',
    options: [
      {
        id: 'cat_Id1',
        identifier: 'cat_identifier1',
        score: 5,
        value: 'Category 1',
        localizedNames: {
          'en-US': 'Electronics',
          'de-DE': 'Elektronik',
        },
      },
      {
        id: 'cat_Id2',
        identifier: 'cat_identifier2',
        score: 15,
        value: 'Category 2',
        localizedNames: {
          'en-US': 'Clothing',
          'de-DE': 'Bekleidung',
        },
      },
    ],
  },
];

const sparqueSearchResonse: SparqueSearch = {
  products: [],
  total: 1,
  facets,
  sortings,
};

const product = { sku: 'SKU1', name: 'Product 1' } as Product;

describe('Sparque Search Mapper', () => {
  let sparqueSearchMapper: SparqueSearchMapper;
  const sparqueProductMapper = mock(SparqueProductMapper);
  const mockAppFacade = mock(AppFacade);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(mockAppFacade) },
        { provide: SparqueProductMapper, useFactory: () => instance(sparqueProductMapper) },
      ],
    });

    when(sparqueProductMapper.fromListData(anything())).thenReturn([product]);
    when(mockAppFacade.currentLocale$).thenReturn(of('en-US'));

    sparqueSearchMapper = TestBed.inject(SparqueSearchMapper);
  });

  describe('fromData', () => {
    it('should map search response correctly', () => {
      const result = sparqueSearchMapper.fromData(sparqueSearchResonse, searchParams);
      expect(result).toMatchInlineSnapshot(`
        {
          "filter": [
            {
              "displayType": "text",
              "facets": [
                {
                  "count": 1,
                  "displayName": "Red",
                  "level": 0,
                  "name": "option_Id1",
                  "searchParameter": {
                    "color": [
                      "option_Id1",
                    ],
                    "searchTerm": [
                      "fancyProduct",
                    ],
                  },
                  "selected": false,
                },
                {
                  "count": 10,
                  "displayName": "Blue",
                  "level": 0,
                  "name": "option_Id2",
                  "searchParameter": {
                    "color": [
                      "option_Id2",
                    ],
                    "searchTerm": [
                      "fancyProduct",
                    ],
                  },
                  "selected": false,
                },
              ],
              "id": "color",
              "limitCount": 5,
              "name": "Color",
              "selectionType": "single",
            },
            {
              "displayType": "text",
              "facets": [
                {
                  "count": 5,
                  "displayName": "Electronics",
                  "level": 0,
                  "name": "cat_Id1",
                  "searchParameter": {
                    "category": [
                      "cat_Id1",
                    ],
                    "searchTerm": [
                      "fancyProduct",
                    ],
                  },
                  "selected": false,
                },
                {
                  "count": 15,
                  "displayName": "Clothing",
                  "level": 0,
                  "name": "cat_Id2",
                  "searchParameter": {
                    "category": [
                      "cat_Id2",
                    ],
                    "searchTerm": [
                      "fancyProduct",
                    ],
                  },
                  "selected": false,
                },
              ],
              "id": "CategoryUUIDLevelMulti",
              "limitCount": 5,
              "name": "Category",
              "selectionType": "single",
            },
          ],
          "products": [
            {
              "name": "Product 1",
              "sku": "SKU1",
            },
          ],
          "sortableAttributes": [
            {
              "displayName": "Price",
              "name": "price",
            },
            {
              "displayName": "Name",
              "name": "name",
            },
          ],
          "total": 1,
        }
      `);
    });

    it('should skip category filter mapping when no selectedCategory is present', () => {
      const result = sparqueSearchMapper.fromData(sparqueSearchResonse, searchParams);
      expect(result).toMatchInlineSnapshot(`
        {
          "filter": [
            {
              "displayType": "text",
              "facets": [
                {
                  "count": 1,
                  "displayName": "Red",
                  "level": 0,
                  "name": "option_Id1",
                  "searchParameter": {
                    "color": [
                      "option_Id1",
                    ],
                    "searchTerm": [
                      "fancyProduct",
                    ],
                  },
                  "selected": false,
                },
                {
                  "count": 10,
                  "displayName": "Blue",
                  "level": 0,
                  "name": "option_Id2",
                  "searchParameter": {
                    "color": [
                      "option_Id2",
                    ],
                    "searchTerm": [
                      "fancyProduct",
                    ],
                  },
                  "selected": false,
                },
              ],
              "id": "color",
              "limitCount": 5,
              "name": "Color",
              "selectionType": "single",
            },
            {
              "displayType": "text",
              "facets": [
                {
                  "count": 5,
                  "displayName": "Electronics",
                  "level": 0,
                  "name": "cat_Id1",
                  "searchParameter": {
                    "category": [
                      "cat_Id1",
                    ],
                    "searchTerm": [
                      "fancyProduct",
                    ],
                  },
                  "selected": false,
                },
                {
                  "count": 15,
                  "displayName": "Clothing",
                  "level": 0,
                  "name": "cat_Id2",
                  "searchParameter": {
                    "category": [
                      "cat_Id2",
                    ],
                    "searchTerm": [
                      "fancyProduct",
                    ],
                  },
                  "selected": false,
                },
              ],
              "id": "CategoryUUIDLevelMulti",
              "limitCount": 5,
              "name": "Category",
              "selectionType": "single",
            },
          ],
          "products": [
            {
              "name": "Product 1",
              "sku": "SKU1",
            },
          ],
          "sortableAttributes": [
            {
              "displayName": "Price",
              "name": "price",
            },
            {
              "displayName": "Name",
              "name": "name",
            },
          ],
          "total": 1,
        }
      `);
    });

    it('should use category filter mapping when selectedCategory is present', () => {
      const categorySearchParams = { searchTerm: ['fancyProduct'], selectedCategory: ['A.B.C'] };
      const result = sparqueSearchMapper.fromData(sparqueSearchResonse, categorySearchParams);
      // mapCategoryFilter excludes the category facet group and adds a selectedCategory facet
      expect(result.filter).toHaveLength(2);
      expect(result.filter.map(f => f.id)).toEqual(['color', 'selectedCategory']);
    });

    it('should handle empty search response gracefully', () => {
      when(sparqueProductMapper.fromListData(anything())).thenReturn([]);
      const emptySearchResponse: SparqueSearch = {
        products: [],
        sortings: [],
        total: 0,
        facets: [],
      };

      const result = sparqueSearchMapper.fromData(emptySearchResponse, {});
      expect(result).toMatchInlineSnapshot(`
        {
          "filter": [],
          "products": [],
          "sortableAttributes": [],
          "total": 0,
        }
      `);
    });
  });

  describe('type mapping functions', () => {
    describe('mapDisplayType', () => {
      it('should map known Sparque display types to PWA types', () => {
        const facetsWithDisplayTypes: SparqueFixedFacetGroup[] = [
          {
            id: 'color',
            title: 'Color',
            attributes: [{ name: 'displayType', value: 'swatch' }],
            options: [{ id: 'red', identifier: 'red', score: 1, value: 'Red' }],
          },
          {
            id: 'brand',
            title: 'Brand',
            attributes: [{ name: 'displayType', value: 'dropdown' }],
            options: [{ id: 'nike', identifier: 'nike', score: 5, value: 'Nike' }],
          },
          {
            id: 'size',
            title: 'Size',
            attributes: [{ name: 'displayType', value: 'checkbox' }],
            options: [{ id: 'xl', identifier: 'xl', score: 3, value: 'XL' }],
          },
          {
            id: 'material',
            title: 'Material',
            attributes: [{ name: 'displayType', value: 'color' }], // should map to swatch
            options: [{ id: 'cotton', identifier: 'cotton', score: 2, value: 'Cotton' }],
          },
          {
            id: 'unknown',
            title: 'Unknown',
            attributes: [{ name: 'displayType', value: 'invalidType' }], // should fallback to text
            options: [{ id: 'test', identifier: 'test', score: 1, value: 'Test' }],
          },
        ];

        const searchResponse: SparqueSearch = {
          products: [],
          total: 0,
          facets: facetsWithDisplayTypes,
          sortings: [],
        };

        const result = sparqueSearchMapper.fromData(searchResponse, {});

        expect(result.filter[0].displayType).toBe('swatch'); // swatch -> swatch
        expect(result.filter[1].displayType).toBe('dropdown'); // dropdown -> dropdown
        expect(result.filter[2].displayType).toBe('checkbox'); // checkbox -> checkbox
        expect(result.filter[3].displayType).toBe('swatch'); // color -> swatch
        expect(result.filter[4].displayType).toBe('text'); // invalidType -> text (fallback)
      });

      it('should default to text when displayType is not provided', () => {
        const facetsWithoutDisplayType: SparqueFixedFacetGroup[] = [
          {
            id: 'category',
            title: 'Category',
            options: [{ id: 'cat1', identifier: 'cat1', score: 1, value: 'Category 1' }],
          },
        ];

        const searchResponse: SparqueSearch = {
          products: [],
          total: 0,
          facets: facetsWithoutDisplayType,
          sortings: [],
        };

        const result = sparqueSearchMapper.fromData(searchResponse, {});
        expect(result.filter[0].displayType).toBe('text');
      });
    });

    describe('mapSelectionType', () => {
      it('should map known Sparque selection types to PWA types', () => {
        const facetsWithSelectionTypes: SparqueFixedFacetGroup[] = [
          {
            id: 'single',
            title: 'Single',
            attributes: [{ name: 'selectionType', value: 'single' }],
            options: [{ id: 'opt1', identifier: 'opt1', score: 1, value: 'Option 1' }],
          },
          {
            id: 'multi',
            title: 'Multi',
            attributes: [{ name: 'selectionType', value: 'multi' }],
            options: [{ id: 'opt2', identifier: 'opt2', score: 2, value: 'Option 2' }],
          },
          {
            id: 'multiple',
            title: 'Multiple',
            attributes: [{ name: 'selectionType', value: 'multiple' }],
            options: [{ id: 'opt3', identifier: 'opt3', score: 3, value: 'Option 3' }],
          },
          {
            id: 'unknown',
            title: 'Unknown',
            attributes: [{ name: 'selectionType', value: 'invalidType' }],
            options: [{ id: 'opt4', identifier: 'opt4', score: 4, value: 'Option 4' }],
          },
        ];

        const searchResponse: SparqueSearch = {
          products: [],
          total: 0,
          facets: facetsWithSelectionTypes,
          sortings: [],
        };

        const result = sparqueSearchMapper.fromData(searchResponse, {});

        expect(result.filter[0].selectionType).toBe('single'); // single -> single
        expect(result.filter[1].selectionType).toBe('single'); // multi -> single (PWA uses checkbox for multi)
        expect(result.filter[2].selectionType).toBe('single'); // multiple -> single (PWA uses checkbox for multi)
        expect(result.filter[3].selectionType).toBe('single'); // invalidType -> single (fallback)
      });

      it('should default to single when selectionType is not provided', () => {
        const facetsWithoutSelectionType: SparqueFixedFacetGroup[] = [
          {
            id: 'category',
            title: 'Category',
            options: [{ id: 'cat1', identifier: 'cat1', score: 1, value: 'Category 1' }],
          },
        ];

        const searchResponse: SparqueSearch = {
          products: [],
          total: 0,
          facets: facetsWithoutSelectionType,
          sortings: [],
        };

        const result = sparqueSearchMapper.fromData(searchResponse, {});
        expect(result.filter[0].selectionType).toBe('single');
      });
    });
  });

  describe('localization functionality', () => {
    it('should fallback to value when no localized name exists', () => {
      const facetWithoutLocalizedNames: SparqueFixedFacetGroup[] = [
        {
          id: 'size',
          title: 'Size',
          options: [
            {
              id: 'size_small',
              identifier: 'small',
              score: 5,
              value: 'Small',
              // No localizedNames property
            },
          ],
        },
      ];

      const searchResponse: SparqueSearch = {
        products: [],
        total: 1,
        facets: facetWithoutLocalizedNames,
        sortings: [],
      };

      const result = sparqueSearchMapper.fromData(searchResponse, {});

      // Should fallback to the value property
      expect(result.filter[0].facets[0].displayName).toBe('Small');
    });
    it('should use German localized display names when locale is de-DE', () => {
      // Create a separate TestBed configuration for German locale
      const germanMockAppFacade = mock(AppFacade);
      when(germanMockAppFacade.currentLocale$).thenReturn(of('de-DE'));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: AppFacade, useFactory: () => instance(germanMockAppFacade) },
          { provide: SparqueProductMapper, useFactory: () => instance(sparqueProductMapper) },
        ],
      });

      const germanMapper = TestBed.inject(SparqueSearchMapper);
      const result = germanMapper.fromData(sparqueSearchResonse, searchParams);

      // Check that German localized names are used
      expect(result.filter[0].facets[0].displayName).toBe('Rot'); // Red in German
      expect(result.filter[0].facets[1].displayName).toBe('Blau'); // Blue in German
      expect(result.filter[1].facets[0].displayName).toBe('Elektronik'); // Electronics in German
      expect(result.filter[1].facets[1].displayName).toBe('Bekleidung'); // Clothing in German
    });
  });
});
