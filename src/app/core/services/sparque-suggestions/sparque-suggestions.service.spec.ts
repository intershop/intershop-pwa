import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SparqueSuggestions } from 'ish-core/models/sparque-suggestions/sparque-suggestions.interface';
import { SparqueSuggestionsMapper } from 'ish-core/models/sparque-suggestions/sparque-suggestions.mapper';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

import { SparqueSuggestionsService } from './sparque-suggestions.service';

describe('Sparque Suggestions Service', () => {
  let sparqueSuggestionsService: SparqueSuggestionsService;
  const sparqueApiService = mock(SparqueApiService);
  const sparqueSuggestionsMapper = mock(SparqueSuggestionsMapper);
  const apiVersion = 'v2';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueApiService, useFactory: () => instance(sparqueApiService) },
        { provide: SparqueSuggestionsMapper, useFactory: () => instance(sparqueSuggestionsMapper) },
      ],
    });
    sparqueSuggestionsService = TestBed.inject(SparqueSuggestionsService);
    when(sparqueSuggestionsMapper.fromData(anything())).thenReturn(undefined);
  });

  it('should map the response using SparqueSuggestionsMapper', done => {
    const suggestions = { keywordSuggestions: [{ keyword: 'test' }] } as SparqueSuggestions;
    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(of<SparqueSuggestions>(suggestions));

    sparqueSuggestionsService.searchSuggestions('test').subscribe(() => {
      verify(sparqueSuggestionsMapper.fromData(suggestions)).once();
      done();
    });
  });
});
