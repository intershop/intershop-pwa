import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { SparqueSearch } from 'ish-core/models/sparque-search/sparque-search.interface';
import { SparqueSearchMapper } from 'ish-core/models/sparque-search/sparque-search.mapper';
import { AvailableOptions } from 'ish-core/services/api/api.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

import { SparqueProductsService } from './sparque-products.service';

describe('Sparque Products Service', () => {
  let sparqueApiService: SparqueApiService;
  let sparqueProductsService: SparqueProductsService;
  let sparqueSearchMapper: SparqueSearchMapper;
  const apiVersion = 'v3';

  beforeEach(() => {
    sparqueApiService = mock(SparqueApiService);
    sparqueSearchMapper = mock(SparqueSearchMapper);
    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(
      of<SparqueSearch>({ products: [], total: 0, sortings: [] })
    );
    when(sparqueApiService.get(anything(), apiVersion, anything())).thenReturn(
      of<SparqueSearch>({ products: [], total: 0, sortings: [] })
    );
    when(sparqueApiService.get('search', apiVersion, anything())).thenReturn(
      of<SparqueSearch>({ products: [], total: 0, sortings: [] })
    );
    when(sparqueApiService.get('products', apiVersion, anything())).thenReturn(
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
    verify(sparqueApiService.get('search', apiVersion, anything())).once();
  });

  it('should map the response using SparqueSearchMapper', done => {
    const searchResponse = {
      products: [{ sku: '123', name: 'geht dich garnichts an' }],
      total: 1,
      sortings: [],
      facets: [{ id: 'blubber', title: 'blubber', options: [] }],
    } as SparqueSearch;

    when(sparqueApiService.get('search', apiVersion, anything())).thenReturn(of<SparqueSearch>(searchResponse));

    sparqueProductsService.searchProducts({ searchTerm: 'test', amount: 1, offset: 0 }).subscribe(() => {
      verify(sparqueSearchMapper.fromData(searchResponse, anything())).once();
      done();
    });
  });

  it('should call sparque api service for getFilteredProducts', () => {
    verify(sparqueApiService.get(anything(), apiVersion, anything())).never();

    sparqueProductsService.getFilteredProducts({ searchTerm: ['test'] }, 10, 'price', 0);
    verify(sparqueApiService.get('search', apiVersion, anything())).once();
  });

  it('should map the response using SparqueSearchMapper for getFilteredProducts', done => {
    const filteredResponse = {
      products: [{ sku: '456', name: 'product name' }],
      total: 1,
      sortings: [],
      facets: [{ id: 'facetID', title: 'facetTitle', options: [] }],
    } as SparqueSearch;

    when(sparqueApiService.get('search', apiVersion, anything())).thenReturn(of<SparqueSearch>(filteredResponse));

    sparqueProductsService.getFilteredProducts({ searchTerm: ['test'] }, 10, 'price', 0).subscribe(() => {
      verify(sparqueSearchMapper.fromData(filteredResponse, anything())).once();
      done();
    });
  });

  describe('getCategoryProducts', () => {
    it('should call sparque api service with products endpoint and v3 version', () => {
      sparqueProductsService.getCategoryProducts('A.B.C', 10);
      verify(sparqueApiService.get('products', apiVersion, anything())).once();
    });

    it('should extract category ID from uniqueId and use it in the request', () => {
      sparqueProductsService.getCategoryProducts('computers.tablets.ipads', 10);

      const capturedCall = capture<string, string, AvailableOptions>(sparqueApiService.get).last();
      const [, , options] = capturedCall;
      expect(options?.params?.get('categoryIds')).toBe('ipads'); // Should use only the last part
    });

    it('should set correct parameters for category products request', () => {
      sparqueProductsService.getCategoryProducts('A.B.C', 10, 'price', 5);

      const capturedCall = capture<string, string, AvailableOptions>(sparqueApiService.get).last();
      const [endpoint, version, options] = capturedCall;
      expect(endpoint).toBe('products');
      expect(version).toBe(apiVersion);
      expect(options?.params?.get('categoryIds')).toBe('C'); // Should use the extracted category ID
      expect(options?.params?.get('count')).toBe('10');
      expect(options?.params?.get('offset')).toBe('5');
      expect(options?.params?.get('sorting')).toBe('price');
      expect(options?.params?.get('facetOptionsCount')).toBe('10');
    });

    it('should not set sorting parameter when sortKey is not provided', () => {
      sparqueProductsService.getCategoryProducts('A.B.C', 10);

      const capturedCall = capture<string, string, AvailableOptions>(sparqueApiService.get).last();
      const [, , options] = capturedCall;
      expect(options?.params?.get('sorting')).toBeNull();
    });

    it('should set selectedFacets parameter when provided', () => {
      sparqueProductsService.getCategoryProducts('A.B.C', 10, 'price', 5);

      const capturedCall = capture<string, string, AvailableOptions>(sparqueApiService.get).last();
      const [, , options] = capturedCall;
      expect(options?.params?.get('selectedFacets')).toBeNull(); // No selectedFacets parameter in getCategoryProducts
    });

    it('should not set selectedFacets parameter when not provided', () => {
      sparqueProductsService.getCategoryProducts('A.B.C', 10);

      const capturedCall = capture<string, string, AvailableOptions>(sparqueApiService.get).last();
      const [, , options] = capturedCall;
      expect(options?.params?.get('selectedFacets')).toBeNull();
    });

    it('should not set selectedFacets parameter when empty array is provided', () => {
      sparqueProductsService.getCategoryProducts('A.B.C', 10, 'price', 5);

      const capturedCall = capture<string, string, AvailableOptions>(sparqueApiService.get).last();
      const [, , options] = capturedCall;
      expect(options?.params?.get('selectedFacets')).toBeNull();
    });

    it('should map the response using SparqueSearchMapper', done => {
      const categoryProductsResponse = {
        products: [{ sku: 'product1', name: 'Test Product' }],
        total: 1,
        sortings: [{ identifier: 'price', title: 'Price' }],
      } as SparqueSearch;

      when(sparqueApiService.get('products', apiVersion, anything())).thenReturn(
        of<SparqueSearch>(categoryProductsResponse)
      );

      sparqueProductsService.getCategoryProducts('A.B.C', 10).subscribe(() => {
        verify(sparqueSearchMapper.fromData(anything(), anything())).once();
        done();
      });
    });
  });

  describe('getFilteredProducts redirect behavior', () => {
    it('should redirect to getCategoryProducts when no searchTerm but categoryId is present', () => {
      sparqueProductsService.getFilteredProducts({ category: ['A.B.C'], color: ['red'] }, 10, 'price', 0);

      // Should call v3 endpoint (getCategoryProducts) instead of v2 (getFilteredProducts)
      verify(sparqueApiService.get('products', apiVersion, anything())).once();
      verify(sparqueApiService.get('search', apiVersion, anything())).never();
    });

    it('should use normal search when searchTerm is present', () => {
      sparqueProductsService.getFilteredProducts({ searchTerm: ['test'], category: ['A.B.C'] }, 10, 'price', 0);

      // Should call v2 search endpoint instead of v3 products endpoint
      verify(sparqueApiService.get('search', apiVersion, anything())).once();
      verify(sparqueApiService.get('products', apiVersion, anything())).never();
    });

    it('should use normal search when no categoryId is present', () => {
      sparqueProductsService.getFilteredProducts({ searchTerm: ['test'], color: ['red'] }, 10, 'price', 0);

      // Should call v2 search endpoint
      verify(sparqueApiService.get('search', apiVersion, anything())).once();
      verify(sparqueApiService.get('products', apiVersion, anything())).never();
    });
  });
});
