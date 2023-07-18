import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';

import { SparqueSuggestService } from './sparque-suggest.service';

describe('Sparque Suggest Service', () => {
  let apiService: SparqueApiService;
  let suggestService: SparqueSuggestService;
  let httpClient: HttpClient;

  beforeEach(() => {
    apiService = mock(SparqueApiService);
    httpClient = mock(HttpClient);
    when(apiService.get(anything())).thenReturn(of());
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useFactory: () => instance(httpClient) },
        { provide: SparqueApiService, useFactory: () => instance(apiService) },
        provideMockStore(),
      ],
    });
    suggestService = TestBed.inject(SparqueSuggestService);
  });

  it('should always delegate to api service when called', () => {
    verify(apiService.get(anything())).never();

    suggestService.search('some');
    verify(apiService.get(anything())).once();
  });

  it('should return the matched terms when search term is executed', done => {
    when(apiService.get(anything())).thenReturn(
      of({
        offset: 0,
        count: 10,
        type: ['STRING'],
        items: [
          {
            rank: 1,
            probability: 1.0,
            tuple: ['Goods'],
          },
        ],
      })
    );

    suggestService.search('g').subscribe(res => {
      expect(res).toMatchInlineSnapshot(`
        [
          {
            "term": "Goods",
            "type": undefined,
          },
        ]
      `);
      verify(apiService.get(anything())).once();
      done();
    });
  });
});
