import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { combineLatest, from, identity } from 'rxjs';
import {
  concatMap,
  distinct,
  distinctUntilChanged,
  exhaustMap,
  filter,
  first,
  groupBy,
  map,
  mapTo,
  mergeMap,
  switchMap,
  switchMapTo,
  take,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { ProductsService } from 'ish-core/services/products/products.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { loadCategory } from 'ish-core/store/shopping/categories';
import { setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import {
  loadProduct,
  loadProductFail,
  loadProductIfNotLoaded,
  loadProductLinks,
  loadProductLinksFail,
  loadProductLinksSuccess,
  loadProductParts,
  loadProductPartsSuccess,
  loadProductSuccess,
  loadProductVariationsFail,
  loadProductVariationsIfNotLoaded as loadProductVariationsIfNotLoaded,
  loadProductVariationsSuccess,
  loadProductsForCategory,
  loadProductsForCategoryFail,
  loadProductsForMaster,
  loadProductsForMasterFail,
} from './products.actions';
import {
  getBreadcrumbForProductPage,
  getProduct,
  getProductEntities,
  getProductParts,
  getProductVariationSKUs,
  getSelectedProduct,
} from './products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private productsService: ProductsService,
    private httpStatusCodeService: HttpStatusCodeService,
    private productListingMapper: ProductListingMapper,
    @Inject(PLATFORM_ID) private platformId: string,
    private router: Router
  ) {}

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProduct),
      mapToPayloadProperty('sku'),
      groupBy(identity),
      mergeMap(group$ =>
        group$.pipe(
          this.throttleOnBrowser(),
          switchMap(sku =>
            this.productsService.getProduct(sku).pipe(
              map(product => loadProductSuccess({ product })),
              mapErrorToAction(loadProductFail, { sku })
            )
          )
        )
      )
    )
  );

  loadProductIfNotLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductIfNotLoaded),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getProductEntities))),
      filter(([{ sku, level }, entities]) => !ProductHelper.isSufficientlyLoaded(entities[sku], level)),
      map(([{ sku }]) => loadProduct({ sku }))
    )
  );

  /**
   * retrieve products for category incremental respecting paging
   */
  loadProductsForCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductsForCategory),
      mapToPayload(),
      map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
      concatMap(({ categoryId, page, sorting }) =>
        this.productsService.getCategoryProducts(categoryId, page, sorting).pipe(
          concatMap(({ total, products, sortableAttributes }) => [
            ...products.map(product => loadProductSuccess({ product })),
            setProductListingPages(
              this.productListingMapper.createPages(
                products.map(p => p.sku),
                'category',
                categoryId,
                {
                  startPage: page,
                  sortableAttributes,
                  sorting,
                  itemCount: total,
                }
              )
            ),
          ]),
          mapErrorToAction(loadProductsForCategoryFail, { categoryId })
        )
      )
    )
  );

  /**
   * retrieve products for category incremental respecting paging
   */
  loadProductsForMaster$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductsForMaster),
      mapToPayload(),
      map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
      concatMap(({ masterSKU, page, sorting }) =>
        this.productsService.getProductsForMaster(masterSKU, page, sorting).pipe(
          concatMap(({ total, products, sortableAttributes }) => [
            ...products.map(product => loadProductSuccess({ product })),
            setProductListingPages(
              this.productListingMapper.createPages(
                products.map(p => p.sku),
                'master',
                masterSKU,
                {
                  startPage: page,
                  sortableAttributes,
                  sorting,
                  itemCount: total,
                }
              )
            ),
          ]),
          mapErrorToAction(loadProductsForMasterFail, { masterSKU })
        )
      )
    )
  );

  loadProductParts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductParts),
      mapToPayloadProperty('sku'),
      groupBy(identity),
      mergeMap(group$ =>
        group$.pipe(
          this.throttleOnBrowser(),
          mergeMap(sku =>
            this.store.pipe(
              select(getProductParts(sku)),
              first(),
              filter(parts => !parts?.length),
              switchMap(() => this.store.pipe(select(getProduct(sku)))),
              filter(product => ProductHelper.isProductBundle(product) || ProductHelper.isRetailSet(product)),
              take(1)
            )
          ),
          exhaustMap(product =>
            ProductHelper.isProductBundle(product)
              ? this.productsService.getProductBundles(product.sku).pipe(
                  mergeMap(({ stubs, bundledProducts: parts }) => [
                    ...stubs.map((stub: Product) => loadProductSuccess({ product: stub })),
                    loadProductPartsSuccess({ sku: product.sku, parts }),
                  ]),
                  mapErrorToAction(loadProductFail, { sku: product.sku })
                )
              : this.productsService.getRetailSetParts(product.sku).pipe(
                  mergeMap(stubs => [
                    ...stubs.map((stub: Product) => loadProductSuccess({ product: stub })),
                    loadProductPartsSuccess({
                      sku: product.sku,
                      parts: stubs.map(stub => ({ sku: stub.sku, quantity: 1 })),
                    }),
                  ]),
                  mapErrorToAction(loadProductFail, { sku: product.sku })
                )
          )
        )
      )
    )
  );

  /**
   * The load product variations effect.
   */
  loadProductVariations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductVariationsIfNotLoaded),
      mapToPayloadProperty('sku'),
      groupBy(identity),
      mergeMap(group$ =>
        group$.pipe(
          this.throttleOnBrowser(),
          mergeMap(sku =>
            this.store.pipe(
              select(getProductVariationSKUs(sku)),
              first(),
              filter(variations => !variations?.length),
              mapTo(sku)
            )
          ),
          exhaustMap(sku =>
            this.productsService.getProductVariations(sku).pipe(
              mergeMap(({ products: variations, defaultVariation, masterProduct }) => [
                ...variations.map(product => loadProductSuccess({ product })),
                loadProductSuccess({ product: masterProduct }),
                loadProductVariationsSuccess({
                  sku,
                  variations: variations.map(p => p.sku),
                  defaultVariation,
                }),
              ]),
              mapErrorToAction(loadProductVariationsFail, { sku })
            )
          )
        )
      )
    )
  );

  /**
   * Trigger load product variations action on product success action for master products.
   * Ignores product variation entries for products that are already present.
   */
  loadProductVariationsForMasterOrVariationProduct$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadProductSuccess),
        mapToPayloadProperty('product'),
        map(product =>
          ProductHelper.isMasterProduct(product)
            ? product.sku
            : ProductHelper.isVariationProduct(product)
            ? product.productMasterSKU
            : undefined
        ),
        whenTruthy(),
        map(sku => loadProductVariationsIfNotLoaded({ sku }))
      ),
    { dispatch: true }
  );

  loadDefaultCategoryContextForProduct$ = createEffect(() =>
    this.store.pipe(
      ofProductUrl(),
      select(getSelectedProduct),
      withLatestFrom(this.store.pipe(select(selectRouteParam('categoryUniqueId')))),
      map(([product, categoryUniqueId]) => !categoryUniqueId && product),
      filter(p => !ProductHelper.isFailedLoading(p)),
      mapToProperty('defaultCategoryId'),
      whenTruthy(),
      distinctUntilChanged(),
      map(categoryId => loadCategory({ categoryId }))
    )
  );

  redirectIfErrorInProducts$ = createEffect(
    () =>
      combineLatest([
        this.actions$.pipe(ofType(loadProductFail), mapToPayloadProperty('sku')),
        this.store.pipe(select(selectRouteParam('sku'))),
      ]).pipe(
        filter(([a, b]) => a === b),
        concatMap(() => from(this.httpStatusCodeService.setStatus(404)))
      ),
    { dispatch: false }
  );

  redirectIfErrorInCategoryProducts$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadProductsForCategoryFail),
        concatMap(() => from(this.httpStatusCodeService.setStatus(404)))
      ),
    { dispatch: false }
  );

  loadProductLinks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductLinks),
      mapToPayloadProperty('sku'),
      distinct(),
      mergeMap(sku =>
        this.productsService.getProductLinks(sku).pipe(
          map(links => loadProductLinksSuccess({ sku, links })),
          mapErrorToAction(loadProductLinksFail, { sku })
        )
      )
    )
  );

  loadLinkedCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductLinksSuccess),
      mapToPayloadProperty('links'),
      map(links =>
        Object.keys(links)
          .reduce((acc, val) => [...acc, ...(links[val].categories || [])], [])
          .filter((val, idx, arr) => arr.indexOf(val) === idx)
      ),
      mergeMap(ids => ids.map(categoryId => loadCategory({ categoryId })))
    )
  );

  setBreadcrumbForProductPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMapTo(
        this.store.pipe(
          ofProductUrl(),
          select(getBreadcrumbForProductPage),
          whenTruthy(),
          map(breadcrumbData => setBreadcrumbData({ breadcrumbData }))
        )
      )
    )
  );

  private throttleOnBrowser<T>() {
    return isPlatformBrowser(this.platformId) && this.router.navigated ? throttleTime<T>(100) : map(identity);
  }
}
