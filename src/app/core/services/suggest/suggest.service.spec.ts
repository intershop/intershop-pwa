import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { SuggestService } from './suggest.service';

describe('Suggest Service', () => {
  let apiService: ApiService;
  let suggestService: SuggestService;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.get(anything(), anything())).thenReturn(of<SuggestTerm[]>([]));
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
    });
    suggestService = TestBed.inject(SuggestService);
  });

  it('should always delegate to api service when called', () => {
    verify(apiService.get(anything(), anything())).never();

    suggestService.search('some');
    verify(apiService.get(anything(), anything())).once();
  });

  it('should return the matched terms when search term is executed', done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ elements: [{ type: undefined, term: 'Goods' }] }));

    suggestService.search('g').subscribe(res => {
      expect(res).toMatchInlineSnapshot(`
        Array [
          Object {
            "term": "Goods",
            "type": undefined,
          },
        ]
      `);
      verify(apiService.get(anything(), anything())).once();
      done();
    });
  });
});
