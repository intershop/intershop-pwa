import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE, RouteNavigation } from 'ngrx-router';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  switchMapTo,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';
import { ProductsService } from '../../../services/products/products.service';
import { LocaleActionTypes } from '../../locale';
import {
  SetPage,
  SetPagingInfo,
  SetPagingLoading,
  SetSortKeys,
  canRequestMore,
  getItemsPerPage,
  getPagingPage,
  getSortBy,
  isEndlessScrollingEnabled,
} from '../viewconf';

import * as productsActions from './products.actions';
import * as productsSelectors from './products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private productsService: ProductsService,
    private router: Router
  ) {}

  @Effect()
  loadProduct$ = this.actions$.pipe(
    ofType<productsActions.LoadProduct>(productsActions.ProductsActionTypes.LoadProduct),
    mapToPayloadProperty('sku'),
    mergeMap(sku =>
      this.productsService.getProduct(sku).pipe(
        map(product => new productsActions.LoadProductSuccess({ product })),
        mapErrorToAction(productsActions.LoadProductFail)
      )
    )
  );

  @Effect()
  loadMoreProductsForCategory$ = this.actions$.pipe(
    ofType<productsActions.LoadMoreProductsForCategory>(
      productsActions.ProductsActionTypes.LoadMoreProductsForCategory
    ),
    mapToPayloadProperty('categoryId'),
    withLatestFrom(
      this.store.pipe(select(isEndlessScrollingEnabled)),
      this.store.pipe(select(canRequestMore)),
      this.store.pipe(
        select(getPagingPage),
        map(n => n + 1)
      )
    ),
    filter(([, endlessScrolling, moreProductsAvailable]) => endlessScrolling && moreProductsAvailable),
    mergeMap(([categoryId, , , page]) => [
      new SetPagingLoading(),
      new SetPage({ pageNumber: page }),
      new productsActions.LoadProductsForCategory({ categoryId }),
    ])
  );

  /**
   * retrieve products for category incremental respecting paging
   */
  @Effect()
  loadProductsForCategory$ = this.actions$.pipe(
    ofType<productsActions.LoadProductsForCategory>(productsActions.ProductsActionTypes.LoadProductsForCategory),
    mapToPayloadProperty('categoryId'),
    withLatestFrom(
      this.store.pipe(select(getPagingPage)),
      this.store.pipe(select(getSortBy)),
      this.store.pipe(select(getItemsPerPage))
    ),
    distinctUntilChanged(),
    concatMap(([categoryUniqueId, page, sortBy, itemsPerPage]) =>
      this.productsService.getCategoryProducts(categoryUniqueId, page, itemsPerPage, sortBy).pipe(
        withLatestFrom(this.store.pipe(select(productsSelectors.getProductEntities))),
        switchMap(([res, entities]) => [
          new SetPagingInfo({
            currentPage: page,
            totalItems: res.total,
            newProducts: res.products.map(p => p.sku),
          }),
          new SetSortKeys({ sortKeys: res.sortKeys }),
          ...res.products
            .filter(stub => !entities[stub.sku])
            .map(stub => new productsActions.LoadProductSuccess({ product: stub })),
        ]),
        mapErrorToAction(productsActions.LoadProductFail)
      )
    )
  );

  @Effect()
  routeListenerForSelectingProducts$ = this.actions$.pipe(
    ofType<RouteNavigation>(ROUTER_NAVIGATION_TYPE),
    map(action => action.payload.params.sku),
    withLatestFrom(this.store.pipe(select(productsSelectors.getSelectedProductId))),
    filter(([fromAction, fromStore]) => fromAction !== fromStore),
    map(([sku]) => new productsActions.SelectProduct({ sku }))
  );

  @Effect()
  selectedProduct$ = this.actions$.pipe(
    ofType<productsActions.SelectProduct>(productsActions.ProductsActionTypes.SelectProduct),
    mapToPayloadProperty('sku'),
    filter(sku => !!sku),
    map(sku => new productsActions.LoadProduct({ sku }))
  );

  /**
   * reload the current (if available) product when language is changed
   */
  @Effect()
  languageChange$ = this.store.pipe(
    select(productsSelectors.getSelectedProduct),
    filter(x => !!x),
    switchMapTo(
      this.actions$.pipe(
        ofType(LocaleActionTypes.SelectLocale),
        distinctUntilChanged(),
        withLatestFrom(this.store.pipe(select(productsSelectors.getSelectedProductId))),
        filter(([, sku]) => !!sku),
        map(([, sku]) => new productsActions.LoadProduct({ sku }))
      )
    )
  );

  @Effect({ dispatch: false })
  redirectIfErrorInProducts$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProductFail),
    tap(() => this.router.navigate(['/error']))
  );
}
