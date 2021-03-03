import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { setProductListingPageSize } from 'ish-core/store/shopping/product-listing';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { FilterService } from './filter.service';

describe('Filter Service', () => {
  let apiService: ApiService;
  let filterService: FilterService;
  const productsMock = {
    elements: [
      { uri: 'products/123', attributes: [{ name: 'sku', value: '123' }] },
      { uri: 'products/234', attributes: [{ name: 'sku', value: '234' }] },
    ],
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
      imports: [CoreStoreModule.forTesting(['configuration']), ShoppingStoreModule.forTesting('productListing')],
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
    });
    TestBed.inject(Store).dispatch(setProductListingPageSize({ itemsPerPage: 2 }));
    filterService = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });

  it("should get Filter data when 'getFilterForCategory' is called", done => {
    when(apiService.get(anything())).thenReturn(of(filterMock));
    filterService.getFilterForCategory('A.B').subscribe(data => {
      expect(data.filter).toHaveLength(1);
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');

      verify(apiService.get(anything())).once();
      expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
        Array [
          "categories/A/B/productfilters",
        ]
      `);

      done();
    });
  });

  it("should get Filter data when 'applyFilter' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of(filterMock));
    filterService.applyFilter({ SearchParameter: ['b'] } as URLFormParams).subscribe(data => {
      expect(data.filter).toHaveLength(1);
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');

      verify(apiService.get(anything(), anything())).once();
      const [resource, params] = capture(apiService.get).last();
      expect(resource).toMatchInlineSnapshot(`"productfilters"`);
      expect((params as AvailableOptions)?.params?.toString()).toMatchInlineSnapshot(`"SearchParameter=b"`);

      done();
    });
  });

  it("should get Product SKUs when 'getFilteredProducts' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of(productsMock));

    filterService.getFilteredProducts({ SearchParameter: ['b'] } as URLFormParams, 1).subscribe(data => {
      expect(data?.products?.map(p => p.sku)).toMatchInlineSnapshot(`
        Array [
          "123",
          "234",
        ]
      `);
      expect(data?.total).toMatchInlineSnapshot(`2`);
      expect(data?.sortableAttributes).toMatchInlineSnapshot(`Array []`);

      verify(apiService.get(anything(), anything())).once();
      const [resource, params] = capture(apiService.get).last();
      expect(resource).toMatchInlineSnapshot(`"products"`);
      expect((params as AvailableOptions)?.params?.toString()).toMatchInlineSnapshot(
        `"amount=2&offset=0&attrs=sku,salePrice,listPrice,availability,manufacturer,image,minOrderQuantity,maxOrderQuantity,stepOrderQuantity,inStock,promotions,packingUnit,mastered,productMaster,productMasterSKU,roundedAverageRating,retailSet&attributeGroup=PRODUCT_LABEL_ATTRIBUTES&returnSortKeys=true&SearchParameter=b"`
      );

      done();
    });
  });
});
