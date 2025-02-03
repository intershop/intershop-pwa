import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SparqueSuggestions } from 'ish-core/models/sparque-suggestion/sparque-suggestion.interface';
import { SparqueSuggestionMapper } from 'ish-core/models/sparque-suggestion/sparque-suggestion.mapper';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

import { SparqueSuggestionService } from './sparque-suggestion.service';

describe('Sparque Suggestion Service', () => {
  let sparqueApiService: SparqueApiService;
  let suggestService: SparqueSuggestionService;
  let sparqueSuggestionMapper: SparqueSuggestionMapper;

  beforeEach(() => {
    sparqueApiService = mock(SparqueApiService);
    sparqueSuggestionMapper = mock(SparqueSuggestionMapper);
    when(sparqueApiService.get(anything(), anything())).thenReturn(of<SparqueSuggestions>({ keywordSuggestions: [] }));
    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueApiService, useFactory: () => instance(sparqueApiService) },
        { provide: SparqueSuggestionMapper, useFactory: () => instance(sparqueSuggestionMapper) },
        SparqueSuggestionService,
      ],
    });
    suggestService = TestBed.inject(SparqueSuggestionService);
  });

  it('should always delegate to api service when called', () => {
    verify(sparqueApiService.get(anything(), anything())).never();

    suggestService.search('some');
    verify(sparqueApiService.get(anything(), anything())).once();
  });

  it('should map the response using SparqueSuggestionMapper', done => {
    const suggestions = { keywordSuggestions: [{ term: 'test' }] };
    when(sparqueApiService.get(anything(), anything())).thenReturn(of<SparqueSuggestions>(suggestions));

    suggestService.search('test').subscribe(() => {
      verify(sparqueSuggestionMapper.fromData(suggestions)).once();
      done();
    });
  });
});
