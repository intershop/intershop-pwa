import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { identity } from 'rxjs';
import {
  concatMap,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  groupBy,
  map,
  mergeMap,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { ProductsService } from 'ish-core/services/products/products.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { LoadCategory } from 'ish-core/store/shopping/categories';
import { SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import {
  LoadProduct,
  LoadProductBundlesSuccess,
  LoadProductFail,
  LoadProductIfNotLoaded,
  LoadProductLinks,
  LoadProductLinksFail,
  LoadProductLinksSuccess,
  LoadProductSuccess,
  LoadProductVariations,
  LoadProductVariationsFail,
  LoadProductVariationsSuccess,
  LoadProductsForCategory,
  LoadProductsForCategoryFail,
  LoadRetailSetSuccess,
  ProductsActionTypes,
} from './products.actions';
import { getProductEntities, getSelectedProduct } from './products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private productsService: ProductsService,
    private httpStatusCodeService: HttpStatusCodeService,
    private productListingMapper: ProductListingMapper,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  @Effect()
  loadProduct$ = this.actions$.pipe(
    ofType<LoadProduct>(ProductsActionTypes.LoadProduct),
    mapToPayloadProperty('sku'),
    mergeMap(sku =>
      this.productsService.getProduct(sku).pipe(
        map(product => new LoadProductSuccess({ product })),
        mapErrorToAction(LoadProductFail, { sku })
      )
    )
  );

  @Effect()
  loadProductIfNotLoaded$ = this.actions$.pipe(
    ofType<LoadProductIfNotLoaded>(ProductsActionTypes.LoadProductIfNotLoaded),
    mapToPayload(),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    filter(([{ sku, level }, entities]) => !ProductHelper.isSufficientlyLoaded(entities[sku], level)),
    groupBy(([{ sku }]) => sku),
    mergeMap(group$ =>
      group$.pipe(
        this.throttleOnBrowser(),
        map(([{ sku }]) => new LoadProduct({ sku }))
      )
    )
  );

  /**
   * retrieve products for category incremental respecting paging
   */
  @Effect()
  loadProductsForCategory$ = this.actions$.pipe(
    ofType<LoadProductsForCategory>(ProductsActionTypes.LoadProductsForCategory),
    mapToPayload(),
    map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
    concatMap(({ categoryId, page, sorting }) =>
      this.productsService.getCategoryProducts(categoryId, page, sorting).pipe(
        concatMap(({ total, products, sortKeys }) => [
          ...products.map(product => new LoadProductSuccess({ product })),
          new SetProductListingPages(
            this.productListingMapper.createPages(
              products.map(p => p.sku),
              'category',
              categoryId,
              {
                startPage: page,
                sortKeys,
                sorting,
                itemCount: total,
              }
            )
          ),
        ]),
        mapErrorToAction(LoadProductsForCategoryFail, { categoryId })
      )
    )
  );

  @Effect()
  loadProductBundles$ = this.actions$.pipe(
    ofType<LoadProductSuccess>(ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(product => ProductHelper.isProductBundle(product)),
    mergeMap(({ sku }) =>
      this.productsService.getProductBundles(sku).pipe(
        mergeMap(({ stubs, bundledProducts }) => [
          ...stubs.map((product: Product) => new LoadProductSuccess({ product })),
          new LoadProductBundlesSuccess({ sku, bundledProducts }),
        ]),
        mapErrorToAction(LoadProductFail, { sku })
      )
    )
  );

  /**
   * The load product variations effect.
   */
  @Effect()
  loadProductVariations$ = this.actions$.pipe(
    ofType<LoadProductVariations>(ProductsActionTypes.LoadProductVariations),
    mapToPayloadProperty('sku'),
    mergeMap(sku =>
      this.productsService.getProductVariations(sku).pipe(
        mergeMap(({ products: variations, defaultVariation }) => [
          ...variations.map((product: Product) => new LoadProductSuccess({ product })),
          new LoadProductVariationsSuccess({
            sku,
            variations: variations.map(p => p.sku),
            defaultVariation,
          }),
        ]),
        mapErrorToAction(LoadProductVariationsFail, { sku })
      )
    )
  );

  /**
   * Trigger load product action if productMasterSKU is set in product success action payload.
   * Ignores products that are already present.
   */
  @Effect()
  loadMasterProductForProduct$ = this.actions$.pipe(
    ofType<LoadProductSuccess>(ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(product => ProductHelper.isVariationProduct(product)),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    filter(
      ([product, entities]: [VariationProduct, Dictionary<VariationProduct>]) => !entities[product.productMasterSKU]
    ),
    groupBy(([product]) => product.productMasterSKU),
    mergeMap(groups =>
      groups.pipe(
        this.throttleOnBrowser(),
        map(
          ([product]) =>
            new LoadProductIfNotLoaded({
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
    ofType<LoadProductSuccess>(ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(product => ProductHelper.isMasterProduct(product)),
    withLatestFrom(this.store.pipe(select(getProductEntities))),
    filter(
      ([product, entities]: [VariationProductMaster, Dictionary<VariationProductMaster>]) =>
        !entities[product.sku] || !entities[product.sku].variationSKUs
    ),
    groupBy(([product]) => product.sku),
    mergeMap(groups =>
      groups.pipe(
        this.throttleOnBrowser(),
        map(([product]) => new LoadProductVariations({ sku: product.sku }))
      )
    )
  );

  /**
   * reloads product when it is selected (usually product detail page)
   * change to {@link LoadProductIfNotLoaded} if no reload is needed
   */
  @Effect()
  selectedProduct$ = this.store.pipe(
    select(selectRouteParam('sku')),
    whenTruthy(),
    map(sku => new LoadProduct({ sku }))
  );

  @Effect()
  loadDefaultCategoryContextForProduct$ = this.store.pipe(
    ofProductUrl(),
    select(getSelectedProduct),
    withLatestFrom(this.store.pipe(select(selectRouteParam('categoryUniqueId')))),
    map(([product, categoryUniqueId]) => !categoryUniqueId && product),
    filter(p => !ProductHelper.isFailedLoading(p)),
    mapToProperty('defaultCategoryId'),
    whenTruthy(),
    distinctUntilChanged(),
    map(categoryId => new LoadCategory({ categoryId }))
  );

  @Effect()
  loadRetailSetProductDetail$ = this.actions$.pipe(
    ofType<LoadProductSuccess>(ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(ProductHelper.isRetailSet),
    mapToProperty('sku'),
    map(
      sku =>
        new LoadProductIfNotLoaded({
          sku,
          level: ProductCompletenessLevel.Detail,
        })
    )
  );

  @Effect()
  loadPartsOfRetailSet$ = this.actions$.pipe(
    ofType<LoadProductSuccess>(ProductsActionTypes.LoadProductSuccess),
    mapToPayloadProperty('product'),
    filter(ProductHelper.isRetailSet),
    mapToProperty('sku'),
    mergeMap(sku =>
      this.productsService
        .getRetailSetParts(sku)
        .pipe(
          mergeMap(stubs => [
            ...stubs.map((product: Product) => new LoadProductSuccess({ product })),
            new LoadRetailSetSuccess({ sku, parts: stubs.map(p => p.sku) }),
          ])
        )
    )
  );

  @Effect({ dispatch: false })
  redirectIfErrorInProducts$ = this.store.pipe(
    ofProductUrl(),
    select(getSelectedProduct),
    whenTruthy(),
    distinctUntilKeyChanged('sku'),
    filter(ProductHelper.isFailedLoading),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
  );

  @Effect({ dispatch: false })
  redirectIfErrorInCategoryProducts$ = this.actions$.pipe(
    ofType(ProductsActionTypes.LoadProductsForCategoryFail),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
  );

  @Effect()
  loadProductLinks$ = this.actions$.pipe(
    ofType<LoadProductLinks>(ProductsActionTypes.LoadProductLinks),
    mapToPayloadProperty('sku'),
    distinct(),
    mergeMap(sku =>
      this.productsService.getProductLinks(sku).pipe(
        map(links => new LoadProductLinksSuccess({ sku, links })),
        mapErrorToAction(LoadProductLinksFail, { sku })
      )
    )
  );

  @Effect()
  loadLinkedCategories$ = this.actions$.pipe(
    ofType<LoadProductLinksSuccess>(ProductsActionTypes.LoadProductLinksSuccess),
    mapToPayloadProperty('links'),
    map(links =>
      Object.keys(links)
        .reduce((acc, val) => [...acc, ...(links[val].categories || [])], [])
        .filter((val, idx, arr) => arr.indexOf(val) === idx)
    ),
    mergeMap(ids => ids.map(categoryId => new LoadCategory({ categoryId })))
  );

  private throttleOnBrowser = () => (isPlatformBrowser(this.platformId) ? throttleTime(3000) : map(identity));
}
