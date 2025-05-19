import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { combineLatest, from, identity } from 'rxjs';
import {
  concatMap,
  distinct,
  exhaustMap,
  filter,
  first,
  groupBy,
  map,
  mergeMap,
  switchMap,
  take,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';

import { Facet } from 'ish-core/models/facet/facet.model';
import { Filter } from 'ish-core/models/filter/filter.model';
import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { ProductsServiceProvider } from 'ish-core/service-provider/products.service-provider';
import { ProductsService } from 'ish-core/services/products/products.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { loadCategory } from 'ish-core/store/shopping/categories';
import { getFilterById, loadFilterSuccess, loadProductsForFilter } from 'ish-core/store/shopping/filter';
import { getProductListingItemsPerPage, setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  delayUntil,
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenTruthy,
} from 'ish-core/utils/operators';
import { URLFormParams } from 'ish-core/utils/url-form-params';

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
  loadProductVariationsIfNotLoaded,
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
    private productsServiceProvider: ProductsServiceProvider,
    private httpStatusCodeService: HttpStatusCodeService,
    private productListingMapper: ProductListingMapper,
    private router: Router
  ) {}

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProduct),
      delayUntil(this.actions$.pipe(ofType(personalizationStatusDetermined))),
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
      concatLatestFrom(() => this.store.pipe(select(getProductEntities))),
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
      concatLatestFrom(() => this.store.pipe(select(getProductListingItemsPerPage('category')))),
      map(([payload, pageSize]) => ({ ...payload, amount: pageSize, offset: (payload.page - 1) * pageSize })),
      mergeMap(({ categoryId, amount, sorting, offset, page }) =>
        this.productsService.getCategoryProducts(categoryId, amount, sorting, offset).pipe(
          concatMap(({ total, products, sortableAttributes }) => [
            ...products.map(product => loadProductSuccess({ product })),
            setProductListingPages(
              this.productListingMapper.createPages(
                products.map(p => p.sku),
                'category',
                categoryId,
                amount,
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
      concatLatestFrom(() => this.store.pipe(select(getProductListingItemsPerPage('master')))),
      map(([payload, pageSize]) => ({ ...payload, amount: pageSize, offset: (payload.page - 1) * pageSize })),
      mergeMap(({ masterSKU, amount, sorting, offset, page }) =>
        this.productsService.getProductsForMaster(masterSKU, amount, sorting, offset).pipe(
          concatMap(({ total, products, sortableAttributes }) => [
            ...products.map(product => loadProductSuccess({ product })),
            setProductListingPages(
              this.productListingMapper.createPages(
                products.map(p => p.sku),
                'master',
                masterSKU,
                amount,
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

  loadFilteredProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductsForFilter),
      mapToPayload(),
      concatLatestFrom(() => this.store.pipe(select(getFilterById('category')))),
      switchMap(([{ id, searchParameter, page, sorting }, categoryFilter]) =>
        this.store.pipe(
          select(getProductListingItemsPerPage(id.type)),
          whenTruthy(),
          first(),
          switchMap(pageSize =>
            this.productsServiceProvider
              // TODO: (Sparque handling) remove this additional parameter once the category navigation will be handled by Sparque
              .get(Object.keys(searchParameter).includes('productFilter'))
              .getFilteredProducts(searchParameter, pageSize, sorting, ((page || 1) - 1) * pageSize)
              .pipe(
                mergeMap(({ products, total, sortableAttributes, filter }) => [
                  ...products.map((product: Product) => loadProductSuccess({ product })),
                  setProductListingPages(
                    this.productListingMapper.createPages(
                      products.map(p => p.sku),
                      id.type,
                      id.value,
                      pageSize,
                      {
                        filters: id.filters,
                        itemCount: total,
                        startPage: page,
                        sortableAttributes,
                        sorting,
                      }
                    )
                  ),
                  filter?.length
                    ? // handle Sparque filter
                      loadFilterSuccess({
                        filterNavigation: {
                          filter: this.handleSparqueCategoryFilter(filter, categoryFilter, searchParameter),
                        },
                      })
                    : { type: 'no_filter_action' },
                ]),
                mapErrorToAction(loadProductFail)
              )
          )
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
              map(() => sku)
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

  loadDefaultCategoryContextForProduct$ = createEffect(() =>
    this.store.pipe(
      ofProductUrl(),
      select(getSelectedProduct),
      withLatestFrom(this.store.pipe(select(selectRouteParam('categoryUniqueId')))),
      map(([product, categoryUniqueId]) => !categoryUniqueId && product),
      filter(p => !ProductHelper.isFailedLoading(p)),
      mapToProperty('defaultCategoryId'),
      whenTruthy(),
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
      switchMap(() =>
        this.store.pipe(
          ofProductUrl(),
          select(getBreadcrumbForProductPage),
          whenTruthy(),
          map(breadcrumbData => setBreadcrumbData({ breadcrumbData }))
        )
      )
    )
  );

  /**
   * Handles the processing of category facets in a search response, ensuring that the facets are updated
   * based on the current search parameters and the stored category facet. This function modifies the
   * replied facets to reflect the selected category facet and its hierarchy.
   *
   * @param repliedFacets - The list of facets returned from the search response.
   * @param storedCategoryFacet - The stored category facet that represents the current category filter.
   * @param searchParameter - The search parameters used in the current search query.
   * @returns The updated list of facets with the processed category facet.
   */
  private handleSparqueCategoryFilter(
    repliedFacets: Filter[],
    storedCategoryFacet: Filter,
    searchParameter: URLFormParams
  ): Filter[] {
    const newFacets = repliedFacets;

    // processing of the category facet only necessary if a category facet is applied in the current search
    if (storedCategoryFacet && searchParameter[storedCategoryFacet.id]) {
      const currentCategoryFacetOption = storedCategoryFacet.facets.find(
        facetOption => facetOption.name === searchParameter[storedCategoryFacet.id][0]
      );

      // get predecessor category facet option 0> necessary to calculate the level of the new facets
      let predecessorCategoryFacetOption: Facet;
      let rootLevel = currentCategoryFacetOption.level;
      storedCategoryFacet.facets.forEach(facetOption => {
        if (facetOption.level < rootLevel) {
          rootLevel = facetOption.level;
          predecessorCategoryFacetOption = facetOption;
        }
      });

      // change parameter of the selected facet option
      const selectedFacetOption = {
        ...currentCategoryFacetOption,
        selected: true,
        searchParameter: predecessorCategoryFacetOption
          ? {
              ...searchParameter,
              [storedCategoryFacet.id]: [
                storedCategoryFacet.facets.find(
                  facetOption =>
                    facetOption.level <= currentCategoryFacetOption.level &&
                    facetOption.name !== currentCategoryFacetOption.name &&
                    facetOption.selected
                ).name,
              ],
            }
          : Object.fromEntries(
              Object.entries(searchParameter).filter(([, value]) => !value.includes(currentCategoryFacetOption.name))
            ),
        count: repliedFacets.find(element => element.id === storedCategoryFacet.id)
          ? repliedFacets
              .filter(element => element.id === storedCategoryFacet.id)
              .flatMap(filter => filter.facets)
              .map(facet => facet.count)
              .reduce((acc, val) => acc + val, 0)
          : currentCategoryFacetOption.count,
      };

      // get predecessor category facet options and change count regarding the selected facet option count
      const predecessorCategoryFacetOptions = storedCategoryFacet.facets
        .filter(facetOption => facetOption.level < currentCategoryFacetOption.level)
        .map(facetOption => ({
          ...facetOption,
          count: selectedFacetOption.count,
        }));

      // increase level of founded facets
      let foundedCategoryFacetOptions: Facet[] = [];

      if (repliedFacets) {
        foundedCategoryFacetOptions = repliedFacets
          .filter(element => element.id === storedCategoryFacet.id)
          .flatMap(filter => filter.facets)
          .map(facetOption => ({ ...facetOption, level: currentCategoryFacetOption.level + 1 }));
      }

      // exchange the updated category facet within the category facet in responded facets if present otherwise add it
      // category facet in responded facets is not present if the selected facet option is a leaf category
      if (newFacets.find(f => f.id === storedCategoryFacet.id)) {
        newFacets.splice(
          newFacets.findIndex((e: Filter) => e.id === storedCategoryFacet.id),
          1,
          {
            ...storedCategoryFacet,
            facets: [...predecessorCategoryFacetOptions, selectedFacetOption, ...foundedCategoryFacetOptions].sort(
              (a, b) => (a.level === b.level ? a.displayName.localeCompare(b.displayName) : a.level - b.level)
            ),
          }
        );
      } else {
        newFacets.push({
          ...storedCategoryFacet,
          facets: [...predecessorCategoryFacetOptions, selectedFacetOption].sort((a, b) =>
            a.level === b.level ? a.displayName.localeCompare(b.displayName) : a.level - b.level
          ),
        });
        newFacets.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return newFacets;
  }

  private throttleOnBrowser<T>() {
    return !SSR && this.router.navigated ? throttleTime<T>(100) : map(identity);
  }
}
