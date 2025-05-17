import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { SparqueSearch } from 'ish-core/models/sparque-search/sparque-search.interface';
import { SparqueSearchMapper } from 'ish-core/models/sparque-search/sparque-search.mapper';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

import { SparqueProductsService } from './sparque-products.service';

describe('Sparque Products Service', () => {
  let sparqueApiService: SparqueApiService;
  let sparqueProductsService: SparqueProductsService;
  let sparqueSearchMapper: SparqueSearchMapper;
  const apiVersion = 'v2';

  beforeEach(() => {
    sparqueApiService = mock(SparqueApiService);
    sparqueSearchMapper = mock(SparqueSearchMapper);
    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(
      of<SparqueSearch>({ products: [], total: 0, sortings: [] })
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueApiService, useFactory: () => instance(sparqueApiService) },
        { provide: SparqueSearchMapper, useFactory: () => instance(sparqueSearchMapper) },
      ],
    });
    sparqueProductsService = TestBed.inject(SparqueProductsService);
  });

  it('should always delegate to sparque api service when called', () => {
    verify(sparqueApiService.get(anything(), apiVersion, anything())).never();

    sparqueProductsService.searchProducts({ searchTerm: 'test', amount: 1, offset: 0 });
    verify(sparqueApiService.get(anything(), apiVersion, anything())).once();
  });

  it('should map the response using SparqueSearchMapper', done => {
    const searchResponse = {
      products: [{ sku: '123', name: 'geht dich garnichts an' }],
      total: 1,
      sortings: [],
      facets: [{ id: 'blubber', title: 'blubber', options: [] }],
    } as SparqueSearch;

    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(of<SparqueSearch>(searchResponse));

    sparqueProductsService.searchProducts({ searchTerm: 'test', amount: 1, offset: 0 }).subscribe(() => {
      verify(sparqueSearchMapper.fromData(searchResponse, anything())).once();
      done();
    });
  });

  it('should call sparque api service for getFilteredProducts', () => {
    verify(sparqueApiService.get(anything(), apiVersion, anything())).never();

    sparqueProductsService.getFilteredProducts({ category: ['electronics'] }, 10, 'price', 0);
    verify(sparqueApiService.get(anything(), apiVersion, anything())).once();
  });

  it('should map the response using SparqueSearchMapper for getFilteredProducts', done => {
    const filteredResponse = {
      products: [{ sku: '456', name: 'product name' }],
      total: 1,
      sortings: [],
      facets: [{ id: 'facetID', title: 'facetTitle', options: [] }],
    } as SparqueSearch;

    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(of<SparqueSearch>(filteredResponse));

    sparqueProductsService.getFilteredProducts({ category: ['electronics'] }, 10, 'price', 0).subscribe(() => {
      verify(sparqueSearchMapper.fromData(filteredResponse, anything())).once();
      done();
    });
  });
});
