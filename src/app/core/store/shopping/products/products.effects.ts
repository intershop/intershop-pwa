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
  filter,
  groupBy,
  map,
  mergeMap,
  switchMap,
  switchMapTo,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
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
  loadProductBundlesSuccess,
  loadProductFail,
  loadProductIfNotLoaded,
  loadProductLinks,
  loadProductLinksFail,
  loadProductLinksSuccess,
  loadProductSuccess,
  loadProductVariations,
  loadProductVariationsFail,
  loadProductVariationsSuccess,
  loadProductsForCategory,
  loadProductsForCategoryFail,
  loadProductsForMaster,
  loadProductsForMasterFail,
  loadRetailSetSuccess,
} from './products.actions';
import { getBreadcrumbForProductPage, getProductEntities, getSelectedProduct } from './products.selectors';

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

  loadProductBundles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(product => ProductHelper.isProductBundle(product)),
      mergeMap(({ sku }) =>
        this.productsService.getProductBundles(sku).pipe(
          mergeMap(({ stubs, bundledProducts }) => [
            ...stubs.map((product: Product) => loadProductSuccess({ product })),
            loadProductBundlesSuccess({ sku, bundledProducts }),
          ]),
          mapErrorToAction(loadProductFail, { sku })
        )
      )
    )
  );

  /**
   * The load product variations effect.
   */
  loadProductVariations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductVariations),
      mapToPayloadProperty('sku'),
      mergeMap(sku =>
        this.productsService.getProductVariations(sku).pipe(
          mergeMap(({ products: variations, defaultVariation }) => [
            ...variations.map((product: Product) => loadProductSuccess({ product })),
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
  );

  /**
   * Trigger load product action if productMasterSKU is set in product success action payload.
   * Ignores products that are already present.
   */
  loadMasterProductForProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(product => ProductHelper.isVariationProduct(product)),
      map((product: VariationProduct) =>
        loadProductIfNotLoaded({
          sku: product.productMasterSKU,
          level: ProductCompletenessLevel.List,
        })
      )
    )
  );

  /**
   * Trigger load product variations action on product success action for master products.
   * Ignores product variation entries for products that are already present.
   */
  loadProductVariationsForMasterProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(product => ProductHelper.isMasterProduct(product)),
      map(product => loadProductVariations({ sku: product.sku }))
    )
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

  loadPartsOfRetailSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductSuccess),
      mapToPayloadProperty('product'),
      filter(ProductHelper.isRetailSet),
      mapToProperty('sku'),
      mergeMap(sku =>
        this.productsService
          .getRetailSetParts(sku)
          .pipe(
            mergeMap(stubs => [
              ...stubs.map((product: Product) => loadProductSuccess({ product })),
              loadRetailSetSuccess({ sku, parts: stubs.map(p => p.sku) }),
            ])
          )
      )
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
