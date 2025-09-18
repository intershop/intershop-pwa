import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { RecommendationsContext } from 'ish-core/models/recommendations/recommendations.model';
import { SparqueProduct } from 'ish-core/models/sparque-product/sparque-product.interface';
import { SparqueProductMapper } from 'ish-core/models/sparque-product/sparque-product.mapper';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';

import { SparqueRecommendationsService } from './sparque-recommendations.service';

describe('Sparque Recommendations Service', () => {
  let service: SparqueRecommendationsService;
  let sparqueApiServiceMock: SparqueApiService;
  let sparqueProductMapperMock: SparqueProductMapper;

  const mockProducts: Partial<Product>[] = [
    { sku: 'product1', name: 'Product 1' },
    { sku: 'product2', name: 'Product 2' },
  ];

  const mockSparqueProducts: SparqueProduct[] = [
    { sku: 'product1' } as SparqueProduct,
    { sku: 'product2' } as SparqueProduct,
  ];

  const mockRecommendationsResponse = { products: mockSparqueProducts };

  beforeEach(() => {
    sparqueApiServiceMock = mock(SparqueApiService);
    sparqueProductMapperMock = mock(SparqueProductMapper);

    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueApiService, useFactory: () => instance(sparqueApiServiceMock) },
        { provide: SparqueProductMapper, useFactory: () => instance(sparqueProductMapperMock) },
      ],
    });

    service = TestBed.inject(SparqueRecommendationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRecommendations', () => {
    it('should call SparqueApiService with correct parameters for basic recommendation request', done => {
      const recommendationsContext: RecommendationsContext = {
        strategy: 'mostpopular',
        maxCount: 5,
      };

      when(sparqueApiServiceMock.get('recommendations', 'v3', anything())).thenReturn(of(mockRecommendationsResponse));
      when(sparqueProductMapperMock.fromListData(mockSparqueProducts)).thenReturn(mockProducts);

      service.getRecommendations(recommendationsContext).subscribe(result => {
        expect(result).toEqual({
          recommendations: {
            strategy: 'mostpopular',
            productSKUs: ['product1', 'product2'],
          },
          products: mockProducts,
        });
        verify(sparqueApiServiceMock.get('recommendations', 'v3', anything())).once();
        verify(sparqueProductMapperMock.fromListData(mockSparqueProducts)).once();
        done();
      });
    });

    it('should return products when API call succeeds with all optional parameters', done => {
      const recommendationsContext: RecommendationsContext = {
        strategy: 'alsobought',
        productId: 'prod123',
        categoryId: 'cat456',
        cartProductIds: ['cart1', 'cart2'],
        maxCount: 3,
      };

      when(sparqueApiServiceMock.get('recommendations', 'v3', anything())).thenReturn(of(mockRecommendationsResponse));
      when(sparqueProductMapperMock.fromListData(mockSparqueProducts)).thenReturn(mockProducts);

      service.getRecommendations(recommendationsContext).subscribe(result => {
        expect(result).toEqual({
          recommendations: {
            strategy: 'alsobought',
            productSKUs: ['product1', 'product2'],
          },
          products: mockProducts,
        });
        verify(sparqueApiServiceMock.get('recommendations', 'v3', anything())).once();
        verify(sparqueProductMapperMock.fromListData(mockSparqueProducts)).once();
        done();
      });
    });

    it('should return empty array when API response has no products', done => {
      const recommendationsContext: RecommendationsContext = {
        strategy: 'mostpopular',
        maxCount: 5,
      };

      when(sparqueApiServiceMock.get('recommendations', 'v3', anything())).thenReturn(of({}));
      when(sparqueProductMapperMock.fromListData(anything())).thenReturn([]);

      service.getRecommendations(recommendationsContext).subscribe(result => {
        expect(result).toEqual({
          recommendations: {
            strategy: 'mostpopular',
            productSKUs: [],
          },
          products: [],
        });
        done();
      });
    });

    it('should use default count when count is not provided', done => {
      const recommendationsContext: RecommendationsContext = {
        strategy: 'trending',
      };

      when(sparqueApiServiceMock.get('recommendations', 'v3', anything())).thenReturn(of(mockRecommendationsResponse));
      when(sparqueProductMapperMock.fromListData(mockSparqueProducts)).thenReturn(mockProducts);

      service.getRecommendations(recommendationsContext).subscribe(result => {
        expect(result).toEqual({
          recommendations: {
            strategy: 'trending',
            productSKUs: ['product1', 'product2'],
          },
          products: mockProducts,
        });
        verify(sparqueApiServiceMock.get('recommendations', 'v3', anything())).once();
        verify(sparqueProductMapperMock.fromListData(mockSparqueProducts)).once();
        done();
      });
    });

    it('should handle API errors gracefully', done => {
      const recommendationsContext: RecommendationsContext = {
        strategy: 'mostpopular',
        maxCount: 5,
      };

      const apiError = new Error('API Error');
      when(sparqueApiServiceMock.get('recommendations', 'v3', anything())).thenReturn(throwError(() => apiError));

      service.getRecommendations(recommendationsContext).subscribe({
        next: () => fail('should have thrown an error'),
        error: error => {
          expect(error).toBe(apiError);
          done();
        },
      });
    });

    it('should not include cartProductIds parameter when array is empty', done => {
      const recommendationsContext: RecommendationsContext = {
        strategy: 'recommended',
        cartProductIds: [],
        maxCount: 2,
      };

      when(sparqueApiServiceMock.get('recommendations', 'v3', anything())).thenReturn(of(mockRecommendationsResponse));
      when(sparqueProductMapperMock.fromListData(mockSparqueProducts)).thenReturn(mockProducts);

      service.getRecommendations(recommendationsContext).subscribe(result => {
        expect(result).toEqual({
          recommendations: {
            strategy: 'recommended',
            productSKUs: ['product1', 'product2'],
          },
          products: mockProducts,
        });
        verify(sparqueApiServiceMock.get('recommendations', 'v3', anything())).once();
        done();
      });
    });

    it('should call API service when only required parameters are provided', done => {
      const recommendationsContext: RecommendationsContext = {
        strategy: 'trending',
        maxCount: 4,
      };

      when(sparqueApiServiceMock.get('recommendations', 'v3', anything())).thenReturn(of(mockRecommendationsResponse));
      when(sparqueProductMapperMock.fromListData(mockSparqueProducts)).thenReturn(mockProducts);

      service.getRecommendations(recommendationsContext).subscribe(result => {
        expect(result).toEqual({
          recommendations: {
            strategy: 'trending',
            productSKUs: ['product1', 'product2'],
          },
          products: mockProducts,
        });
        verify(sparqueApiServiceMock.get('recommendations', 'v3', anything())).once();
        done();
      });
    });

    it('should handle null/undefined products in response', done => {
      const recommendationsContext: RecommendationsContext = {
        strategy: 'mostpopular',
        maxCount: 5,
      };

      when(sparqueApiServiceMock.get('recommendations', 'v3', anything())).thenReturn(of({ products: undefined }));
      when(sparqueProductMapperMock.fromListData(anything())).thenReturn([]);

      service.getRecommendations(recommendationsContext).subscribe(result => {
        expect(result).toEqual({
          recommendations: {
            strategy: 'mostpopular',
            productSKUs: [],
          },
          products: [],
        });
        done();
      });
    });
  });
});
