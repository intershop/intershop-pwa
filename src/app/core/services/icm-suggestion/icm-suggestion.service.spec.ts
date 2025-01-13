import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Suggestion } from 'ish-core/models/suggestion/suggestion.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { ICMSuggestionService } from './icm-suggestion.service';

describe('Icm Suggestion Service', () => {
  let apiService: ApiService;
  let suggestService: ICMSuggestionService;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.get(anything(), anything())).thenReturn(of<Suggestion>({}));
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiService) }],
    });
    suggestService = TestBed.inject(ICMSuggestionService);
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
        {
          "keywordSuggestions": [
            "Goods",
          ],
        }
      `);
      verify(apiService.get(anything(), anything())).once();
      done();
    });
  });
});
