import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mergeMap } from 'rxjs/operators';

import { RecommendationsServiceProvider } from 'ish-core/service-provider/recommendations.service-provider';
import { getCurrentBasket } from 'ish-core/store/customer/basket';
import { getSelectedCategory } from 'ish-core/store/shopping/categories';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { loadProductSuccess } from 'ish-core/store/shopping/products/products.actions';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { recommendationsActions } from './recommendations.actions';

@Injectable()
export class RecommendationsEffects {
  constructor(
    private actions$: Actions,
    private recommendationsServiceProvider: RecommendationsServiceProvider,
    private store: Store
  ) {}

  loadProductRecommendations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recommendationsActions.loadProductRecommendations),
      filter(() => !!this.recommendationsServiceProvider.get()),
      mapToPayloadProperty('recommendationsParams'),
      concatLatestFrom(() => [
        this.store.pipe(select(getCurrentBasket)),
        this.store.pipe(select(getSelectedCategory)),
        this.store.pipe(select(getSelectedProduct)),
      ]),
      map(([recommendationsParams, basket, category, product]) => ({
        recommendationsContext: {
          ...recommendationsParams,
          productId: product?.sku,
          categoryId: category?.uniqueId ? category.uniqueId.split('.').pop() : undefined,
          cartProductIds: basket?.lineItems?.map(item => item.productSKU) || [],
        },
      })),
      mergeMap(({ recommendationsContext }) =>
        this.recommendationsServiceProvider
          .get()
          .getRecommendations(recommendationsContext)
          .pipe(
            concatMap(response => [
              recommendationsActions.loadProductRecommendationsSuccess({
                recommendations: response.recommendations,
              }),
              ...response.products.map(product => loadProductSuccess({ product })),
            ]),
            mapErrorToAction(recommendationsActions.loadProductRecommendationsFail)
          )
      )
    )
  );
}
