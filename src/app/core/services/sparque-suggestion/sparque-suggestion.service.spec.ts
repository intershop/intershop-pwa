import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SparqueSuggestions } from 'ish-core/models/sparque-suggestion/sparque-suggestion.interface';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

import { SparqueSuggestionService } from './sparque-suggestion.service';

describe('Sparque Suggestion Service', () => {
  let sparqueApiService: SparqueApiService;
  let suggestService: SparqueSuggestionService;

  beforeEach(() => {
    sparqueApiService = mock(SparqueApiService);
    when(sparqueApiService.get(anything(), anything())).thenReturn(of<SparqueSuggestions>({ keywordSuggestions: [] }));
    TestBed.configureTestingModule({
      providers: [{ provide: SparqueApiService, useFactory: () => instance(sparqueApiService) }],
    });
    suggestService = TestBed.inject(SparqueSuggestionService);
  });

  it('should always delegate to api service when called', () => {
    verify(sparqueApiService.get(anything(), anything())).never();

    suggestService.search('some');
    verify(sparqueApiService.get(anything(), anything())).once();
  });

  it('should return the matched terms when search term is executed', done => {
    when(sparqueApiService.get(anything(), anything())).thenReturn(of({ keywordSuggestions: [{ keyword: 'Goods' }] }));

    suggestService.search('g').subscribe(res => {
      expect(res.keywordSuggestions).toContainEqual('Goods');
      verify(sparqueApiService.get(anything(), anything())).once();
      done();
    });
  });
});
