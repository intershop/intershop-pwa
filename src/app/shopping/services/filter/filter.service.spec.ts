import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { anything, mock, verify, when } from 'ts-mockito';
import { instance } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { FilterNavigationData } from '../../../models/filter-navigation/filter-navigation.interface';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  let apiService: ApiService;
  let filterService;
  const productsMock = {
    elements: [{ uri: 'products/123' }, { uri: 'products/234' }],
  };
  const filterMock = {
    elements: [{ name: 'blubb', displayType: 'text_clear', facets: [{ name: 'a' }, { name: 'b' }] }],
  };
  beforeEach(() => {
    apiService = mock(ApiService);

    TestBed.configureTestingModule({
      providers: [FilterService, { provide: ApiService, useFactory: () => instance(apiService) }],
    });
    filterService = new FilterService(instance(apiService));
  });

  it(
    'should be created',
    inject([FilterService], (service: FilterService) => {
      expect(service).toBeTruthy();
    })
  );

  it("should get Filter data when 'getFilterForCategory' is called", () => {
    when(apiService.get('filters', anything())).thenReturn(of(filterMock as FilterNavigationData));
    filterService.getFilterForCategory('a', 'b').subscribe(data => {
      expect(data.filter.length).toEqual(1);
      expect(data.filter[0].facets.length).toEqual(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');
    });
    verify(apiService.get(`filters`, anything())).once();
  });

  it("should get Filter data when 'applyFilter' is called", () => {
    when(apiService.get('filters/a;SearchParameter=b')).thenReturn(of(filterMock as FilterNavigationData));
    filterService.applyFilter('a', 'b').subscribe(data => {
      expect(data.filter.length).toEqual(1);
      expect(data.filter[0].facets.length).toEqual(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');
    });
    verify(apiService.get('filters/a;SearchParameter=b')).once();
  });

  it("should get Product SKUs when 'getProductSkusForFilter' is called", () => {
    when(apiService.get('filters/a;SearchParameter=b/hits')).thenReturn(of(productsMock));
    filterService.getProductSkusForFilter('a', 'b').subscribe(data => {
      expect(data).toEqual(['123', '234']);
    });
    verify(apiService.get('filters/a;SearchParameter=b/hits')).once();
  });
});
