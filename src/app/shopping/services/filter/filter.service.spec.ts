import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from '../../../core/services/api/api.service';
import { Category } from '../../../models/category/category.model';
import { FilterNavigationData } from '../../../models/filter-navigation/filter-navigation.interface';

import { FilterService } from './filter.service';

describe('Filter Service', () => {
  let apiService: ApiService;
  let filterService;
  const productsMock = {
    elements: [{ uri: 'products/123' }, { uri: 'products/234' }],
  };
  const filterMock = {
    elements: [
      {
        name: 'blubb',
        displayType: 'text_clear',
        facets: [
          { name: 'a', link: { uri: 'domain/filters/dahinter' } },
          { name: 'b', link: { uri: 'domain/filters/dahinter' } },
        ],
      },
    ],
  };
  beforeEach(() => {
    apiService = mock(ApiService);

    TestBed.configureTestingModule({
      providers: [FilterService, { provide: ApiService, useFactory: () => instance(apiService) }],
    });
    filterService = TestBed.get(FilterService);
  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });

  it("should get Filter data when 'getFilterForCategory' is called", done => {
    when(apiService.get('filters', anything())).thenReturn(of(filterMock as FilterNavigationData));
    filterService.getFilterForCategory({ name: 'a', uniqueId: 'A.B' } as Category).subscribe(data => {
      expect(data.filter).toHaveLength(1);
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');
      verify(apiService.get(`filters`, anything())).once();
      done();
    });
  });

  it("should get Filter data when 'applyFilter' is called", done => {
    when(apiService.get('filters/a;SearchParameter=b')).thenReturn(of(filterMock as FilterNavigationData));
    filterService.applyFilter('a', 'b').subscribe(data => {
      expect(data.filter).toHaveLength(1);
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');
      verify(apiService.get('filters/a;SearchParameter=b')).once();
      done();
    });
  });

  it("should get Product SKUs when 'getProductSkusForFilter' is called", done => {
    when(apiService.get('filters/a;SearchParameter=b/hits')).thenReturn(of(productsMock));
    filterService.getProductSkusForFilter('a', 'b').subscribe(data => {
      expect(data).toEqual(['123', '234']);
      verify(apiService.get('filters/a;SearchParameter=b/hits')).once();
      done();
    });
  });
});
