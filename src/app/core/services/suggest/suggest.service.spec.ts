import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Keyword } from 'ish-core/models/keyword/keyword.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { SuggestService } from './suggest.service';

describe('Suggest Service', () => {
  let apiService: ApiService;
  let suggestService: SuggestService;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.get(anything(), anything())).thenReturn(of<Keyword[]>([]));
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
    });
    suggestService = TestBed.inject(SuggestService);
  });

  it('should always delegate to api service when called', () => {
    verify(apiService.get(anything(), anything())).never();

    suggestService.searchSuggestions('some');
    verify(apiService.get(anything(), anything())).once();
  });

  it('should return the matched terms when search term is executed', done => {
    when(apiService.get(anything(), anything())).thenReturn(of({ elements: [{ type: undefined, term: 'Goods' }] }));

    suggestService.searchSuggestions('g').subscribe(res => {
      expect(res).toMatchInlineSnapshot(`
        {
          "suggestions": {
            "keywords": [
              {
                "keyword": "Goods",
              },
            ],
          },
        }
      `);
      verify(apiService.get(anything(), anything())).once();
      done();
    });
  });
});
