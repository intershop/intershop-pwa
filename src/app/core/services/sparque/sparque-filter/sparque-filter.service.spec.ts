import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { SparqueOptionsResponse } from 'ish-core/models/sparque/sparque.interface';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { SparqueFilterService } from './sparque-filter.service';

describe('Sparque Filter Service', () => {
  let apiService: SparqueApiService;
  let filterService: FilterService;
  let httpClient: HttpClient;

  const filterMock = {
    id: 'test',
    title: 'test',
    selected: [],
    options: [
      {
        id: 'a',
        score: 1.0,
        value: 'a',
        title: 'a',
      },
      {
        id: 'b',
        score: 1.0,
        value: 'b',
        title: 'b',
      },
    ],
  } as SparqueOptionsResponse;

  beforeEach(() => {
    apiService = mock(SparqueApiService);
    httpClient = mock(HttpClient);

    TestBed.configureTestingModule({
      providers: [
        { provide: FilterService, useClass: SparqueFilterService },
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: SparqueApiService, useFactory: () => instance(apiService) },
        provideMockStore(),
      ],
    });
    filterService = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });

  it("should get Filter data when 'applyFilter' is called", done => {
    when(apiService.get(anything())).thenReturn(of(filterMock));
    when(apiService.getRelevantInformation$()).thenReturn(of([[], '', '']));
    filterService.applyFilter({ searchTerm: [`blubb`], filter: ['coolestOption'] } as URLFormParams).subscribe(data => {
      expect(data.filter).toHaveLength(2);
      expect(data.filter[0].id).toEqual('test');
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');

      verify(apiService.get(anything())).twice();
      const [resource] = capture(apiService.get).last();
      expect(resource).toContain(`/e/facet_filter/p/attribute/filter/p/value/1(coolestOption)/`);
      expect(resource).toContain(`p/keyword/blubb/`);

      done();
    });
  });

  it("should get Filter data when 'getFilterForSearch' is called", done => {
    when(apiService.get(anything())).thenReturn(of(filterMock));
    when(apiService.getRelevantInformation$()).thenReturn(of([[], '', '']));
    filterService.getFilterForSearch('testblubb').subscribe(data => {
      expect(data.filter).toHaveLength(2);
      expect(data.filter[0].id).toEqual('test');
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');

      verify(apiService.get(anything())).twice();
      const [resource] = capture(apiService.get).last();
      expect(resource).toContain(`p/keyword/testblubb/`);

      done();
    });
  });
});
