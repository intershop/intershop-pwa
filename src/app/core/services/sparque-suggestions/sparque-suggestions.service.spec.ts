import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SparqueSearchResponse } from 'ish-core/models/sparque-search/sparque-search.interface';
import { SparqueSuggestions } from 'ish-core/models/sparque-suggestions/sparque-suggestions.interface';
import { SparqueSuggestionsMapper } from 'ish-core/models/sparque-suggestions/sparque-suggestions.mapper';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

import { SparqueSuggestionsService } from './sparque-suggestions.service';

describe('Sparque Suggestions Service', () => {
  let sparqueApiService: SparqueApiService;
  let sparqueSuggestionsService: SparqueSuggestionsService;
  let sparqueSuggestionsMapper: SparqueSuggestionsMapper;
  const apiVersion = 'v2';

  beforeEach(() => {
    sparqueApiService = mock(SparqueApiService);
    sparqueSuggestionsService = mock(SparqueSuggestionsService);
    sparqueSuggestionsMapper = mock(SparqueSuggestionsMapper);
    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(
      of<SparqueSearchResponse>({ products: [], total: 0, sortings: [] })
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueApiService, useFactory: () => instance(sparqueApiService) },
        { provide: SparqueSuggestionsMapper, useFactory: () => instance(sparqueSuggestionsMapper) },
        { provide: SparqueSuggestionsService, useFactory: () => instance(sparqueSuggestionsService) },
      ],
    });
    sparqueSuggestionsService = TestBed.inject(SparqueSuggestionsService);
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
