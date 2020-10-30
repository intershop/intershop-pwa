import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { getProductListingItemsPerPage } from 'ish-core/store/shopping/product-listing';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { FilterService } from './filter.service';

describe('Filter Service', () => {
  let apiService: ApiService;
  let filterService: FilterService;
  const productsMock = {
    elements: [{ uri: 'products/123' }, { uri: 'products/234' }],
    total: 2,
  };
  const filterMock = {
    elements: [
      {
        name: 'blubb',
        id: 'test',
        displayType: 'text_clear',
        selectionType: 'single',
        filterEntries: [
          { name: 'a', link: { uri: 'domain/productfilters/dahinter?SearchParameter=' } },
          { name: 'b', link: { uri: 'domain/productfilters/dahinter?SearchParameter=' } },
        ],
      },
    ],
  } as FilterNavigationData;

  beforeEach(() => {
    apiService = mock(ApiService);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        provideMockStore({
          selectors: [
            {
              selector: getProductListingItemsPerPage,
              value: { itemsPerPage: 2 },
            },
          ],
        }),
      ],
    });
    filterService = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });

  it("should get Filter data when 'getFilterForCategory' is called", done => {
    when(apiService.get('categories/A/B/productfilters', anything())).thenReturn(of(filterMock));
    filterService.getFilterForCategory('A.B').subscribe(data => {
      expect(data.filter).toHaveLength(1);
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');
      verify(apiService.get('categories/A/B/productfilters', anything())).once();
      done();
    });
  });

  it("should get Filter data when 'applyFilter' is called", done => {
    when(apiService.get<FilterNavigationData>('productfilters?SearchParameter=b', anything())).thenReturn(
      of(filterMock)
    );
    filterService.applyFilter({ SearchParameter: ['b'] } as URLFormParams).subscribe(data => {
      expect(data.filter).toHaveLength(1);
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');
      verify(apiService.get('productfilters?SearchParameter=b', anything())).once();
      done();
    });
  });

  it("should get Product SKUs when 'getFilteredProducts' is called", done => {
    when(apiService.get('products?SearchParameter=b&returnSortKeys=true', anything())).thenReturn(of(productsMock));

    filterService.getFilteredProducts({ SearchParameter: ['b'] } as URLFormParams, 1).subscribe(data => {
      expect(data).toEqual({
        productSKUs: ['123', '234'],
        total: 2,
      });
      verify(apiService.get('products?SearchParameter=b&returnSortKeys=true', anything())).once();
      done();
    });
  });
});
