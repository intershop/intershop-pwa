import { TestBed } from '@angular/core/testing';
import { anything, instance, mock, when } from 'ts-mockito';

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
      { id: 'option_Id1', identifier: 'option_identifier1', score: 1, value: 'value1' },
      { id: 'option_Id2', identifier: 'option_identifier2', score: 10, value: 'value2' },
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SparqueProductMapper, useFactory: () => instance(sparqueProductMapper) }],
    });
    sparqueSearchMapper = TestBed.inject(SparqueSearchMapper);
    when(sparqueProductMapper.fromListData(anything())).thenReturn([product]);
  });

  describe('fromData', () => {
    it('should map search response correctly', () => {
      const result = sparqueSearchMapper.fromData(sparqueSearchResonse, searchParams);
      expect(result).toMatchInlineSnapshot(`
        {
          "filter": [
            {
              "displayType": "text_clear",
              "facets": [
                {
                  "count": 1,
                  "displayName": "value1",
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
                  "displayName": "value2",
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
});
