import { TestBed } from '@angular/core/testing';

import { Recommendations } from 'ish-core/models/recommendations/recommendations.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { recommendationsActions } from './recommendations.actions';
import { getRecommendationsForStrategy } from './recommendations.selectors';

describe('Recommendations Selectors', () => {
  let store$: StoreWithSnapshots;

  const similarProductsRecommendations: Recommendations = {
    strategy: 'similar_products',
    productSKUs: ['REC1', 'REC2'],
  };

  const categoryRecommendations: Recommendations = {
    strategy: 'category_recommendations',
    productSKUs: ['CAT_REC1', 'CAT_REC2', 'CAT_REC3'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), ShoppingStoreModule.forTesting('productRecommendations')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('with empty state', () => {
    it('should not select any product recommendations when used', () => {
      expect(getRecommendationsForStrategy('similar_products')(store$.state)).toBeUndefined();
      expect(getRecommendationsForStrategy('category_recommendations')(store$.state)).toBeUndefined();
    });
  });

  describe('loading product recommendations', () => {
    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(
          recommendationsActions.loadProductRecommendationsSuccess({
            recommendations: similarProductsRecommendations,
          })
        );
      });

      it('should put the product recommendations to the state', () => {
        expect(getRecommendationsForStrategy('similar_products')(store$.state)).toEqual(similarProductsRecommendations);
      });

      it('should return undefined for non-existent strategy', () => {
        expect(getRecommendationsForStrategy('non_existent_strategy')(store$.state)).toBeUndefined();
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(
          recommendationsActions.loadProductRecommendationsFail({ error: makeHttpError({ message: 'error' }) })
        );
      });

      it('should not have loaded product recommendations on error', () => {
        expect(getRecommendationsForStrategy('similar_products')(store$.state)).toBeUndefined();
        expect(getRecommendationsForStrategy('category_recommendations')(store$.state)).toBeUndefined();
      });
    });
  });

  describe('state with multiple product recommendations', () => {
    beforeEach(() => {
      store$.dispatch(
        recommendationsActions.loadProductRecommendationsSuccess({
          recommendations: similarProductsRecommendations,
        })
      );
      store$.dispatch(
        recommendationsActions.loadProductRecommendationsSuccess({ recommendations: categoryRecommendations })
      );
    });

    describe('selecting product recommendations by strategy', () => {
      it('should return the correct product recommendation for similar_products strategy', () => {
        expect(getRecommendationsForStrategy('similar_products')(store$.state)).toMatchInlineSnapshot(`
          {
            "productSKUs": [
              "REC1",
              "REC2",
            ],
            "strategy": "similar_products",
          }
        `);
      });

      it('should return the correct product recommendation for category_recommendations strategy', () => {
        expect(getRecommendationsForStrategy('category_recommendations')(store$.state)).toMatchInlineSnapshot(`
          {
            "productSKUs": [
              "CAT_REC1",
              "CAT_REC2",
              "CAT_REC3",
            ],
            "strategy": "category_recommendations",
          }
        `);
      });

      it('should return undefined for non-existent strategy', () => {
        expect(getRecommendationsForStrategy('cart_recommendations')(store$.state)).toBeUndefined();
      });
    });
  });

  describe('updating existing product recommendations', () => {
    beforeEach(() => {
      store$.dispatch(
        recommendationsActions.loadProductRecommendationsSuccess({
          recommendations: similarProductsRecommendations,
        })
      );
    });

    it('should update existing product recommendation when dispatching with same strategy', () => {
      const updatedRecommendation: Recommendations = {
        strategy: 'similar_products',
        productSKUs: ['NEW_REC1', 'NEW_REC2', 'NEW_REC3'],
      };

      store$.dispatch(
        recommendationsActions.loadProductRecommendationsSuccess({ recommendations: updatedRecommendation })
      );

      expect(getRecommendationsForStrategy('similar_products')(store$.state)).toEqual(updatedRecommendation);
      expect(getRecommendationsForStrategy('similar_products')(store$.state).productSKUs).toHaveLength(3);
    });
  });

  describe('with empty recommended products', () => {
    it('should handle recommendations with no products', () => {
      const emptyRecommendation: Recommendations = {
        strategy: 'empty_strategy',
        productSKUs: [],
      };

      store$.dispatch(
        recommendationsActions.loadProductRecommendationsSuccess({ recommendations: emptyRecommendation })
      );

      expect(getRecommendationsForStrategy('empty_strategy')(store$.state)).toEqual(emptyRecommendation);
      expect(getRecommendationsForStrategy('empty_strategy')(store$.state).productSKUs).toBeEmpty();
    });
  });
});
