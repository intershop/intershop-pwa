import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { mapToParam, ofRoute } from 'ngrx-router';
import {
  concatMap,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  groupBy,
  map,
  mergeMap,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ofProductRoute } from 'ish-core/routing/product/product.route';
import { ProductsService } from 'ish-core/services/products/products.service';
import { LoadCategory } from 'ish-core/store/shopping/categories';
import { SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenFalsy,
  whenTruthy,
} from 'ish-core/utils/operators';

import * as productsActions from './products.actions';
import * as productsSelectors from './products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private productsService: ProductsService,
    private httpStatusCodeService: HttpStatusCodeService,
    private productListingMapper: ProductListingMapper
  ) {}

  @Effect()
  loadProduct$ = this.actions$.pipe(
    ofType<productsActions.LoadProduct>(productsActions.ProductsActionTypes.LoadProduct),
    mapToPayloadProperty('sku'),
    mergeMap(sku =>
      this.productsService.getProduct(sku).pipe(
        map(product => new productsActions.LoadProductSuccess({ product })),
        mapErrorToAction(productsActions.LoadProductFail, { sku })
      )
    )
  );

  @Effect()
  loadProductIfNotLoaded$ = this.actions$.pipe(
    ofType<productsActions.LoadProductIfNotLoaded>(productsActions.ProductsActionTypes.LoadProductIfNotLoaded),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(productsSelectors.getProductEntities))),
    filter(([{ sku, level }, entities]) => !ProductHelper.isSufficientlyLoaded(entities[sku], level)),
    groupBy(([{ sku }]) => sku),
    mergeMap(group$ =>
      group$.pipe(
        throttleTime(3000),
        map(([{ sku }]) => new productsActions.LoadProduct({ sku }))
      )
    )
  );

  /**
   * retrieve products for category incremental respecting paging
   */
  @Effect()
  loadProductsForCategory$ = this.actions$.pipe(
    ofType<productsActions.LoadProductsForCategory>(productsActions.ProductsActionTypes.LoadProductsForCategory),
    mapToPayload(),
    map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
    concatMap(({ categoryId, page, sorting }) =>
      this.productsService.getCategoryProducts(categoryId, page, sorting).pipe(
        concatMap(({ total, products, sortKeys }) => [
          ...products.map(product => new productsActions.LoadProductSuccess({ product })),
          new SetProductListingPages(
            this.productListingMapper.createPages(products.map(p => p.sku), 'category', categoryId, {
              startPage: page,
              sortKeys,
              sorting,
              itemCount: total,
            })
          ),
        ]),
        mapErrorToAction(productsActions.LoadProductsForCategoryFail, { categoryId })
      )
    )
  );

  @Effect()
  loadProductBundles$ = this.actions$.pipe(
    ofType<productsActions.LoadProductSuccess>(productsActions.ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(product => ProductHelper.isProductBundle(product)),
    mergeMap(({ sku }) =>
      this.productsService.getProductBundles(sku).pipe(
        mergeMap(({ stubs, bundledProducts }) => [
          ...stubs.map((product: Product) => new productsActions.LoadProductSuccess({ product })),
          new productsActions.LoadProductBundlesSuccess({ sku, bundledProducts }),
        ]),
        mapErrorToAction(productsActions.LoadProductFail, { sku })
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
        mergeMap(({ products: variations, defaultVariation }) => [
          ...variations.map((product: Product) => new productsActions.LoadProductSuccess({ product })),
          new productsActions.LoadProductVariationsSuccess({
            sku,
            variations: variations.map(p => p.sku),
            defaultVariation,
          }),
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
        throttleTime(3000),
        map(
          ([product]) =>
            new productsActions.LoadProductIfNotLoaded({
              sku: product.productMasterSKU,
              level: ProductCompletenessLevel.List,
            })
        )
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
        throttleTime(3000),
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

  /**
   * reloads product when it is selected (usually product detail page)
   * change to {@link LoadProductIfNotLoaded} if no reload is needed
   */
  @Effect()
  selectedProduct$ = this.actions$.pipe(
    ofType<productsActions.SelectProduct>(productsActions.ProductsActionTypes.SelectProduct),
    mapToPayloadProperty('sku'),
    whenTruthy(),
    map(sku => new productsActions.LoadProduct({ sku }))
  );

  @Effect()
  loadDefaultCategoryContextForProduct$ = this.actions$.pipe(
    ofProductRoute(),
    mapToParam('categoryUniqueId'),
    whenFalsy(),
    switchMap(() =>
      this.store.pipe(
        select(productsSelectors.getSelectedProduct),
        whenTruthy(),
        filter(p => !ProductHelper.isFailedLoading(p)),
        filter(product => !product.defaultCategory()),
        mapToProperty('defaultCategoryId'),
        whenTruthy(),
        distinctUntilChanged(),
        map(categoryId => new LoadCategory({ categoryId })),
        takeUntil(this.actions$.pipe(ofRoute()))
      )
    )
  );

  @Effect()
  loadRetailSetProductDetail$ = this.actions$.pipe(
    ofType<productsActions.LoadProductSuccess>(productsActions.ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(ProductHelper.isRetailSet),
    mapToProperty('sku'),
    map(
      sku =>
        new productsActions.LoadProductIfNotLoaded({
          sku,
          level: ProductCompletenessLevel.Detail,
        })
    )
  );

  @Effect()
  loadPartsOfRetailSet$ = this.actions$.pipe(
    ofType<productsActions.LoadProductSuccess>(productsActions.ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(ProductHelper.isRetailSet),
    mapToProperty('sku'),
    mergeMap(sku =>
      this.productsService
        .getRetailSetParts(sku)
        .pipe(
          mergeMap(stubs => [
            ...stubs.map((product: Product) => new productsActions.LoadProductSuccess({ product })),
            new productsActions.LoadRetailSetSuccess({ sku, parts: stubs.map(p => p.sku) }),
          ])
        )
    )
  );

  @Effect({ dispatch: false })
  redirectIfErrorInProducts$ = this.actions$.pipe(
    ofProductRoute(),
    switchMapTo(
      this.store.pipe(
        select(productsSelectors.getSelectedProduct),
        whenTruthy(),
        distinctUntilKeyChanged('sku'),
        filter(ProductHelper.isFailedLoading),
        take(1)
      )
    ),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
  );

  @Effect({ dispatch: false })
  redirectIfErrorInCategoryProducts$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProductsForCategoryFail),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
  );

  @Effect()
  loadProductLinks$ = this.actions$.pipe(
    ofType<productsActions.LoadProductLinks>(productsActions.ProductsActionTypes.LoadProductLinks),
    mapToPayloadProperty('sku'),
    distinct(),
    mergeMap(sku =>
      this.productsService.getProductLinks(sku).pipe(
        map(links => new productsActions.LoadProductLinksSuccess({ sku, links })),
        mapErrorToAction(productsActions.LoadProductLinksFail, { sku })
      )
    )
  );

  @Effect()
  loadLinkedCategories$ = this.actions$.pipe(
    ofType<productsActions.LoadProductLinksSuccess>(productsActions.ProductsActionTypes.LoadProductLinksSuccess),
    mapToPayloadProperty('links'),
    map(links =>
      Object.keys(links)
        .reduce((acc, val) => [...acc, ...(links[val].categories || [])], [])
        .filter((val, idx, arr) => arr.indexOf(val) === idx)
    ),
    mergeMap(ids => ids.map(categoryId => new LoadCategory({ categoryId })))
  );
}
