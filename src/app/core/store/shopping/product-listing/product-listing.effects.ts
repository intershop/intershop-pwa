import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { ProductsServiceProvider } from 'ish-core/service-provider/products.service-provider';
import { getDeviceType } from 'ish-core/store/core/configuration';
import { selectQueryParam, selectQueryParams } from 'ish-core/store/core/router';
import { getUserAuthorized } from 'ish-core/store/customer/user';
import {
  applyFilter,
  loadFilterForCategory,
  loadFilterForMaster,
  loadFilterForSearch,
  loadProductsForFilter,
} from 'ish-core/store/shopping/filter';
import { loadProductsForCategory, loadProductsForMaster } from 'ish-core/store/shopping/products';
import { searchProducts } from 'ish-core/store/shopping/search';
import { InjectSingle } from 'ish-core/utils/injection';
import { mapToPayload, whenFalsy, whenTruthy } from 'ish-core/utils/operators';
import { stringToFormParams } from 'ish-core/utils/url-form-params';

import {
  loadMoreProducts,
  loadMoreProductsForParams,
  setProductListingPageSize,
  setViewType,
} from './product-listing.actions';
import { getProductListingViewType } from './product-listing.selectors';

/**
 * Shape used for deduplication comparisons in product-listing effect streams.
 */
interface ListingDistinctData {
  id?: { type?: string };
  type?: string;
}

/**
 * Treat requests as duplicates for non-search listing types only.
 * Search requests are intentionally excluded so repeated identical searches are re-dispatched.
 */
function isDuplicateForNonSearch<T extends ListingDistinctData>(previous: T, current: T) {
  const previousType = previous.id?.type || previous.type;
  const currentType = current.id?.type || current.type;

  return previousType !== 'search' && currentType !== 'search' && isEqual(previous, current);
}

function isDuplicateForNonSearchAction(previous: Action, current: Action) {
  return previous.type !== searchProducts.type && current.type !== searchProducts.type && isEqual(previous, current);
}

@Injectable()
export class ProductListingEffects {
  constructor(
    @Inject(PRODUCT_LISTING_ITEMS_PER_PAGE) private itemsPerPage: InjectSingle<typeof PRODUCT_LISTING_ITEMS_PER_PAGE>,
    @Inject(DEFAULT_PRODUCT_LISTING_VIEW_TYPE)
    private defaultViewType: InjectSingle<typeof DEFAULT_PRODUCT_LISTING_VIEW_TYPE>,
    private actions$: Actions,
    private productsServiceProvider: ProductsServiceProvider,
    private store: Store,
    private router: Router
  ) {}

  initializePageSize$ = createEffect(() =>
    this.actions$.pipe(
      take(1),
      map(() => setProductListingPageSize({ itemsPerPage: this.itemsPerPage }))
    )
  );

  initializeDefaultViewType$ =
    !SSR &&
    createEffect(() =>
      this.store.pipe(
        select(getProductListingViewType),
        whenFalsy(),
        withLatestFrom(this.store.pipe(select(getDeviceType))),
        map(([, deviceType]) =>
          typeof this.defaultViewType === 'object' ? this.defaultViewType[deviceType] : this.defaultViewType
        ),
        map(viewType => setViewType({ viewType }))
      )
    );

  setViewTypeFromQueryParam$ = createEffect(() =>
    this.store.pipe(
      select(selectQueryParam('view')),
      whenTruthy(),
      distinctUntilChanged(),
      map((viewType: ViewType) => setViewType({ viewType }))
    )
  );

  /**
   * determine params for search & category pages
   *
   * case #1
   * refresh page (F5): initialPage is set by GET parameter "page" and will be used for the first time
   * (initial page)
   *
   * case #2
   * endless scroll: initialPage is reset after first usage and params.page will be used for endless scroll
   *
   * extra
   * the result is also the cache key for caching product lists in loadMoreProducts$
   */
  determineParams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMoreProducts),
      mapToPayload(),
      switchMap(({ id, page }) => {
        let initialPage = page; // scope variable (reset after first usage)
        const currentPath = this.router.url.split('?')[0]; // capture current path without query params
        return this.store.pipe(
          select(selectQueryParams),
          // filter router changes which have nothing to do with product lists like login
          filter(
            params =>
              !!params?.filters ||
              !!params?.view ||
              !!params?.sorting ||
              !!params?.page ||
              // allow common tracking parameters from Google, Matomo, Meta
              Object.keys(params || {}).some(
                key => key.startsWith('utm_') || key.startsWith('mtm_') || key.endsWith('clid')
              ) ||
              // allow empty params
              Object.keys(params)?.length === 0
          ),
          concatLatestFrom(() => this.store.pipe(select(getUserAuthorized))),
          map(([params, isAuthorized]) => {
            const filters = params.filters
              ? {
                  ...stringToFormParams(params.filters),
                  ...(id.type === 'search' ? { searchTerm: [id.value] } : {}),
                  ...(id.type === 'master' ? { MasterSKU: [id.value] } : {}),
                }
              : undefined;

            const p = initialPage || +params.page || undefined; // determine page

            initialPage = 0; // reset scope variable

            return {
              id: { ...id, filters },
              sorting: params.sorting || undefined,
              page: p > 1 ? p : undefined, // same content for 0, 1 & undefined
              filters,
              isAuthorized, // change return value after login state changes
            };
          }),
          // complete only when the actual route path changes, not just query params
          takeUntil(
            this.router.events.pipe(
              filter(
                (event): event is NavigationStart =>
                  event instanceof NavigationStart && event.url.split('?')[0] !== currentPath
              )
            )
          )
        );
      }),
      distinctUntilChanged(isDuplicateForNonSearch),
      // prevent an unnecessary loadMoreProductsForParamsAction in case a new search is triggered and a query parameter like a filter had been previously been set
      debounceTime(1),
      map(({ id, filters, sorting, page }) => loadMoreProductsForParams({ id, filters, sorting, page }))
    )
  );

  loadMoreProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMoreProductsForParams),
      mapToPayload(),
      distinctUntilChanged(isDuplicateForNonSearch),
      map(({ id, sorting, page, filters }) => {
        if (filters) {
          const searchParameter = filters;
          return loadProductsForFilter({ id: { ...id, filters }, searchParameter, page, sorting });
        } else {
          switch (id.type) {
            case 'category':
              return loadProductsForCategory({ categoryId: id.value, page, sorting });
            case 'search':
              return searchProducts({ searchTerm: id.value, page, sorting });
            case 'master':
              return loadProductsForMaster({ masterSKU: id.value, page, sorting });
            default:
              return;
          }
        }
      }),
      whenTruthy(),
      distinctUntilChanged(isDuplicateForNonSearchAction)
    )
  );

  loadFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMoreProductsForParams),
      mapToPayload(),
      map(({ id, filters }) => ({ type: id.type, value: id.value, filters })),
      distinctUntilChanged(isDuplicateForNonSearch),
      concatLatestFrom(() => this.store.pipe(select(getUserAuthorized))),

      // TODO: (Sparque handling) temporary solution until the category navigation will be handled by Sparque
      concatLatestFrom(() => this.productsServiceProvider.isSparqueSearchEnabled()),
      filter(([[{ type }, _], isSparqueSearchEnabled]) => !isSparqueSearchEnabled || type !== 'search'),
      map(([[{ type, value, filters }, _], _isSparqueEnabled]) => {
        if (filters) {
          const searchParameter = filters;
          return applyFilter({ searchParameter });
        } else {
          switch (type) {
            case 'category':
              return loadFilterForCategory({ uniqueId: value });
            case 'search':
              return loadFilterForSearch({ searchTerm: value });
            case 'master':
              return loadFilterForMaster({ masterSKU: value });
            default:
              return;
          }
        }
      }),
      whenTruthy()
    )
  );
}
