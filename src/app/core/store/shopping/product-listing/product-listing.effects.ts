import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { DeviceType, ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { getDeviceType } from 'ish-core/store/core/configuration';
import { selectQueryParam, selectQueryParams } from 'ish-core/store/core/router';
import {
  applyFilter,
  loadFilterForCategory,
  loadFilterForMaster,
  loadFilterForSearch,
  loadProductsForFilter,
} from 'ish-core/store/shopping/filter';
import { loadProductsForCategory, loadProductsForMaster } from 'ish-core/store/shopping/products';
import { searchProducts } from 'ish-core/store/shopping/search';
import { mapToPayload, whenFalsy, whenTruthy } from 'ish-core/utils/operators';
import { stringToFormParams } from 'ish-core/utils/url-form-params';

import {
  loadMoreProducts,
  loadMoreProductsForParams,
  setProductListingPageSize,
  setViewType,
} from './product-listing.actions';
import { getProductListingViewType } from './product-listing.selectors';

@Injectable()
export class ProductListingEffects {
  constructor(
    @Inject(PRODUCT_LISTING_ITEMS_PER_PAGE) private itemsPerPage: number,
    @Inject(DEFAULT_PRODUCT_LISTING_VIEW_TYPE)
    private defaultViewType: ViewType | Partial<Record<DeviceType, ViewType>>,
    private actions$: Actions,
    private store: Store
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
   * endless scroll: initialPage is resetted after first usage and params.page will be used for endless scroll
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
        return this.store.pipe(
          select(selectQueryParams),
          // filter router changes which have nothing to do with product lists like login
          filter(
            params => !!params?.filters || !!params?.sorting || !!params?.page || Object.keys(params)?.length === 0
          ),
          map(params => {
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
            };
          })
        );
      }),
      distinctUntilChanged(isEqual),
      map(({ id, filters, sorting, page }) => loadMoreProductsForParams({ id, filters, sorting, page }))
    )
  );

  loadMoreProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMoreProductsForParams),
      mapToPayload(),
      distinctUntilChanged(isEqual),
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
      distinctUntilChanged(isEqual)
    )
  );

  loadFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMoreProductsForParams),
      mapToPayload(),
      map(({ id, filters }) => ({ type: id.type, value: id.value, filters })),
      distinctUntilChanged(isEqual),
      map(({ type, value, filters }) => {
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
