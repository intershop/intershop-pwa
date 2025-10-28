import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import {
  Recommendations,
  RecommendationsContext,
  RecommendationsParams,
} from 'ish-core/models/recommendations/recommendations.model';
import { RecommendationsServiceProvider } from 'ish-core/service-provider/recommendations.service-provider';
import { SparqueRecommendationsService } from 'ish-core/services/sparque-recommendations/sparque-recommendations.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadProductSuccess } from 'ish-core/store/shopping/products/products.actions';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { recommendationsActions } from './recommendations.actions';
import { RecommendationsEffects } from './recommendations.effects';

describe('Recommendations Effects', () => {
  let actions$: Observable<Action>;
  let effects: RecommendationsEffects;
  let recommendationsServiceMock: SparqueRecommendationsService;
  let recommendationsServiceProviderMock: RecommendationsServiceProvider;

  const mockRecommendationInput: RecommendationsParams = {
    strategy: 'similar_products',
    maxCount: 5,
  };

  const mockRecommendationOutput: Recommendations = {
    strategy: 'similar_products',
    productSKUs: ['REC1', 'REC2'],
  };

  const mockProducts: Partial<Product>[] = [
    { sku: 'REC1', name: 'Recommended Product 1', completenessLevel: 0 },
    { sku: 'REC2', name: 'Recommended Product 2', completenessLevel: 0 },
  ];

  beforeEach(() => {
    recommendationsServiceMock = mock(SparqueRecommendationsService);
    recommendationsServiceProviderMock = mock(RecommendationsServiceProvider);

    when(recommendationsServiceMock.getRecommendations(anything())).thenCall((input: RecommendationsContext) => {
      if (input.strategy === 'invalid') {
        return throwError(() => makeHttpError({ message: 'invalid' }));
      } else {
        return of({
          recommendations: {
            strategy: input.strategy,
            productSKUs: ['REC1', 'REC2'],
          },
          products: mockProducts,
        });
      }
    });

    // Mock the service provider to return the mocked service
    when(recommendationsServiceProviderMock.get()).thenReturn(instance(recommendationsServiceMock));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['configuration']),
        CustomerStoreModule.forTesting('basket'),
        ShoppingStoreModule.forTesting('categories', 'products', 'productRecommendations'),
      ],
      providers: [
        { provide: RecommendationsServiceProvider, useFactory: () => instance(recommendationsServiceProviderMock) },
        provideMockActions(() => actions$),
        RecommendationsEffects,
      ],
    });

    effects = TestBed.inject(RecommendationsEffects);
  });

  describe('loadProductRecommendations$', () => {
    it('should call the recommendationsService for LoadProductRecommendations action', done => {
      const action = recommendationsActions.loadProductRecommendations({
        recommendationsParams: mockRecommendationInput,
      });
      actions$ = of(action);

      effects.loadProductRecommendations$.subscribe(() => {
        verify(recommendationsServiceMock.getRecommendations(anything())).once();
        done();
      });
    });

    it('should map to actions of type LoadProductSuccess and LoadProductRecommendationsSuccess', () => {
      const action = recommendationsActions.loadProductRecommendations({
        recommendationsParams: mockRecommendationInput,
      });
      const expectedActions = [
        recommendationsActions.loadProductRecommendationsSuccess({ recommendations: mockRecommendationOutput }),
        loadProductSuccess({ product: mockProducts[0] }),
        loadProductSuccess({ product: mockProducts[1] }),
      ];
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(bcd)', {
        b: expectedActions[0],
        c: expectedActions[1],
        d: expectedActions[2],
      });

      expect(effects.loadProductRecommendations$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadProductRecommendationsFail', () => {
      const invalidInput: RecommendationsParams = {
        strategy: 'invalid',
        maxCount: 5,
      };
      const action = recommendationsActions.loadProductRecommendations({ recommendationsParams: invalidInput });
      const completion = recommendationsActions.loadProductRecommendationsFail({
        error: makeHttpError({ message: 'invalid' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductRecommendations$).toBeObservable(expected$);
    });

    it('should handle product recommendations with category filter', done => {
      const categoryRecommendation: RecommendationsParams = {
        strategy: 'category_recommendations',
        maxCount: 10,
      };

      const action = recommendationsActions.loadProductRecommendations({
        recommendationsParams: categoryRecommendation,
      });
      actions$ = of(action);

      effects.loadProductRecommendations$.subscribe(() => {
        verify(recommendationsServiceMock.getRecommendations(anything())).once();
        done();
      });
    });

    it('should handle product recommendations with cart products', done => {
      const cartRecommendation: RecommendationsParams = {
        strategy: 'cart_recommendations',
        maxCount: 3,
      };

      const action = recommendationsActions.loadProductRecommendations({
        recommendationsParams: cartRecommendation,
      });
      actions$ = of(action);

      effects.loadProductRecommendations$.subscribe(() => {
        verify(recommendationsServiceMock.getRecommendations(anything())).once();
        done();
      });
    });

    it('should handle empty product list from service', () => {
      when(recommendationsServiceMock.getRecommendations(anything())).thenReturn(
        of({
          recommendations: { strategy: mockRecommendationInput.strategy, productSKUs: [] },
          products: [],
        })
      );

      const action = recommendationsActions.loadProductRecommendations({
        recommendationsParams: mockRecommendationInput,
      });
      const expectedActions = [
        recommendationsActions.loadProductRecommendationsSuccess({
          recommendations: { strategy: mockRecommendationInput.strategy, productSKUs: [] },
        }),
      ];
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(c)', {
        c: expectedActions[0],
      });

      expect(effects.loadProductRecommendations$).toBeObservable(expected$);
    });
  });
});
