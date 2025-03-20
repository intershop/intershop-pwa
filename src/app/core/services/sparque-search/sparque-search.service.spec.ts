import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SparqueSearchResponse } from 'ish-core/models/sparque-search/sparque-search.interface';
import { SparqueSearchMapper } from 'ish-core/models/sparque-search/sparque-search.mapper';
import { SparqueSuggestions } from 'ish-core/models/sparque-suggestion/sparque-suggestion.interface';
import { SparqueSuggestionMapper } from 'ish-core/models/sparque-suggestion/sparque-suggestion.mapper';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

import { SparqueSearchService } from './sparque-search.service';

describe('Sparque Search Service', () => {
  let sparqueApiService: SparqueApiService;
  let searchService: SparqueSearchService;
  let sparqueSearchMapper: SparqueSearchMapper;
  let sparqueSuggestionMapper: SparqueSuggestionMapper;

  beforeEach(() => {
    sparqueApiService = mock(SparqueApiService);
    sparqueSearchMapper = mock(SparqueSearchMapper);
    sparqueSuggestionMapper = mock(SparqueSuggestionMapper);
    when(sparqueApiService.get(anything(), anything())).thenReturn(
      of<SparqueSearchResponse>({ products: [], total: 0, sortings: [] })
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueApiService, useFactory: () => instance(sparqueApiService) },
        { provide: SparqueSearchMapper, useFactory: () => instance(sparqueSearchMapper) },
        { provide: SparqueSuggestionMapper, useFactory: () => instance(sparqueSuggestionMapper) },
      ],
    });
    searchService = TestBed.inject(SparqueSearchService);
  });

  it('should always delegate to sparque api service when called', () => {
    verify(sparqueApiService.get(anything(), anything())).never();

    searchService.searchProducts({ searchTerm: 'test', amount: 1, offset: 0 });
    verify(sparqueApiService.get(anything(), anything())).once();
  });

  it('should map the response using SparqueSuggestionMapper', done => {
    const suggestions = { keywordSuggestions: [{ keyword: 'test' }] } as SparqueSuggestions;
    when(sparqueApiService.get(anything(), anything())).thenReturn(of<SparqueSuggestions>(suggestions));

    searchService.search('test').subscribe(() => {
      verify(sparqueSuggestionMapper.fromData(suggestions)).once();
      done();
    });
  });

  it('should map the response using SparqueSearchMapper', done => {
    const searchResponse = {
      products: [{ sku: '123', name: 'geht dich garnichts an', defaultcategoryId: 'catID' }],
      total: 1,
      sortings: [],
      facets: [{ id: 'blubber', title: 'blubber', options: [] }],
    } as SparqueSearchResponse;

    when(sparqueApiService.get(anything(), anything())).thenReturn(of<SparqueSearchResponse>(searchResponse));

    searchService.searchProducts({ searchTerm: 'test', amount: 1, offset: 0 }).subscribe(() => {
      verify(sparqueSearchMapper.fromData(searchResponse, anything())).once();
      done();
    });
  });

  it('should call sparque api service for getFilteredProducts', () => {
    verify(sparqueApiService.get(anything(), anything())).never();

    searchService.getFilteredProducts({ category: ['electronics'] }, 10, 'price', 0);
    verify(sparqueApiService.get(anything(), anything())).once();
  });

  it('should map the response using SparqueSearchMapper for getFilteredProducts', done => {
    const filteredResponse = {
      products: [{ sku: '456', name: 'product name', defaultcategoryId: 'catID' }],
      total: 1,
      sortings: [],
      facets: [{ id: 'facetID', title: 'facetTitle', options: [] }],
    } as SparqueSearchResponse;

    when(sparqueApiService.get(anything(), anything())).thenReturn(of<SparqueSearchResponse>(filteredResponse));

    searchService.getFilteredProducts({ category: ['electronics'] }, 10, 'price', 0).subscribe(() => {
      verify(sparqueSearchMapper.fromData(filteredResponse, anything())).once();
      done();
    });
  });
});
