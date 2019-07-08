import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { mapToParam, ofRoute } from 'ngrx-router';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  groupBy,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenTruthy,
} from 'ish-core/utils/operators';
import { ProductsService } from '../../../services/products/products.service';
import { LoadCategory } from '../categories';
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
    private router: Router,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  @Effect()
  loadProduct$ = this.actions$.pipe(
    ofType<productsActions.LoadProduct>(productsActions.ProductsActionTypes.LoadProduct),
    mapToPayloadProperty('sku'),
    mergeMap(
      sku =>
        this.productsService.getProduct(sku).pipe(
          map(product => new productsActions.LoadProductSuccess({ product })),
          mapErrorToAction(productsActions.LoadProductFail, { sku })
        ),
      5
    )
  );

  @Effect()
  loadProductIfNotLoaded$ = this.actions$.pipe(
    ofType<productsActions.LoadProductIfNotLoaded>(productsActions.ProductsActionTypes.LoadProductIfNotLoaded),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(productsSelectors.getProductEntities))),
    filter(([{ sku, level }, entities]) => !ProductHelper.isProductCompletelyLoaded(entities[sku], level)),
    map(([{ sku }]) => new productsActions.LoadProduct({ sku }))
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
    mergeMap(([categoryId, , , pageNumber]) => [
      new SetPagingLoading(),
      new SetPage({ pageNumber }),
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
    concatMap(([categoryId, currentPage, sortBy, itemsPerPage]) =>
      this.productsService.getCategoryProducts(categoryId, currentPage, itemsPerPage, sortBy).pipe(
        withLatestFrom(this.store.pipe(select(productsSelectors.getProductEntities))),
        switchMap(([{ total: totalItems, products, sortKeys }, entities]) => [
          new SetPagingInfo({ currentPage, totalItems, newProducts: products.map(p => p.sku) }),
          new SetSortKeys({ sortKeys }),
          ...products
            .filter(stub => !entities[stub.sku])
            .map(product => new productsActions.LoadProductSuccess({ product })),
        ]),
        mapErrorToAction(productsActions.LoadProductsForCategoryFail, { categoryId })
      )
    )
  );

  /**
   * The load product variations effect.
   */
  @Effect()
  loadProductVariations$ = this.actions$.pipe(
    ofType<productsActions.LoadProductVariations>(productsActions.ProductsActionTypes.LoadProductVariations),
    mapToPayloadProperty('sku'),
    mergeMap(sku =>
      this.productsService.getProductVariations(sku).pipe(
        mergeMap((variations: VariationProduct[]) => [
          ...variations.map(product => new productsActions.LoadProductSuccess({ product })),
          new productsActions.LoadProductVariationsSuccess({ sku, variations: variations.map(p => p.sku) }),
        ]),
        mapErrorToAction(productsActions.LoadProductVariationsFail, { sku })
      )
    )
  );

  /**
   * Trigger load product action if productMasterSKU is set in product success action payload.
   * Ignores products that are already present.
   */
  @Effect()
  loadMasterProductForProduct$ = this.actions$.pipe(
    ofType<productsActions.LoadProductSuccess>(productsActions.ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(product => ProductHelper.isVariationProduct(product)),
    withLatestFrom(this.store.pipe(select(productsSelectors.getProductEntities))),
    filter(
      ([product, entities]: [VariationProduct, Dictionary<VariationProduct>]) => !entities[product.productMasterSKU]
    ),
    groupBy(([product]) => product.productMasterSKU),
    mergeMap(groups =>
      groups.pipe(
        throttleTime(10000),
        map(([product]) => new productsActions.LoadProduct({ sku: product.productMasterSKU }))
      )
    )
  );

  /**
   * Trigger load product variations action on product success action for master products.
   * Ignores product variation entries for products that are already present.
   */
  @Effect()
  loadProductVariationsForMasterProduct$ = this.actions$.pipe(
    ofType<productsActions.LoadProductSuccess>(productsActions.ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(product => ProductHelper.isMasterProduct(product)),
    withLatestFrom(this.store.pipe(select(productsSelectors.getProductEntities))),
    filter(
      ([product, entities]: [VariationProductMaster, Dictionary<VariationProductMaster>]) =>
        !entities[product.sku] || !entities[product.sku].variationSKUs
    ),
    groupBy(([product]) => product.sku),
    mergeMap(groups =>
      groups.pipe(
        throttleTime(10000),
        map(([product]) => new productsActions.LoadProductVariations({ sku: product.sku }))
      )
    )
  );

  @Effect()
  routeListenerForSelectingProducts$ = this.actions$.pipe(
    ofRoute(),
    mapToParam<string>('sku'),
    withLatestFrom(this.store.pipe(select(productsSelectors.getSelectedProductId))),
    filter(([fromAction, fromStore]) => fromAction !== fromStore),
    map(([sku]) => new productsActions.SelectProduct({ sku }))
  );

  @Effect()
  selectedProduct$ = this.actions$.pipe(
    ofType<productsActions.SelectProduct>(productsActions.ProductsActionTypes.SelectProduct),
    mapToPayloadProperty('sku'),
    whenTruthy(),
    map(sku => new productsActions.LoadProduct({ sku }))
  );

  @Effect()
  loadDefaultCategoryContextForProduct$ = this.actions$.pipe(
    ofRoute(/^product/),
    switchMap(() =>
      this.store.pipe(
        select(productsSelectors.getSelectedProduct),
        whenTruthy(),
        filter(product => !product.defaultCategory()),
        mapToProperty('defaultCategoryId'),
        whenTruthy(),
        distinctUntilChanged(),
        map(categoryId => new LoadCategory({ categoryId })),
        takeUntil(this.actions$.pipe(ofRoute()))
      )
    )
  );

  @Effect({ dispatch: false })
  redirectIfErrorInProducts$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProductFail),
    filter(() => this.router.url.includes('/product/')),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
  );

  @Effect({ dispatch: false })
  redirectIfErrorInCategoryProducts$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProductsForCategoryFail),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
  );
}
