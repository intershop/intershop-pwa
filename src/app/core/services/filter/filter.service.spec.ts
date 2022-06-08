import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FilterNavigationData } from 'ish-core/models/filter-navigation/filter-navigation.interface';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { URLFormParams } from 'ish-core/utils/url-form-params';

import { FilterService } from './filter.service';

describe('Filter Service', () => {
  let apiService: ApiService;
  let filterService: FilterService;
  let appFacadeMock: AppFacade;

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
    appFacadeMock = mock(AppFacade);

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['configuration'])],
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
    });
    filterService = TestBed.inject(FilterService);

    when(appFacadeMock.serverSetting$(anyString())).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });

  it("should get Filter data when 'getFilterForCategory' is called", done => {
    when(apiService.get(anything(), anything())).thenReturn(of(filterMock));
    filterService.getFilterForCategory('A.B').subscribe(data => {
      expect(data.filter).toHaveLength(1);
      expect(data.filter[0].facets).toHaveLength(2);
      expect(data.filter[0].facets[0].name).toEqual('a');
      expect(data.filter[0].facets[1].name).toEqual('b');

      verify(apiService.get(anything(), anything())).once();
      expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
        Array [
          "categories/A/B/productfilters",
          Object {
            "sendSPGID": true,
          },
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
});
