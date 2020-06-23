import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import b64u from 'b64u';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, filter, map, mapTo, mergeMap, switchMap, take } from 'rxjs/operators';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { ProductMasterVariationsService } from 'ish-core/services/product-master-variations/product-master-variations.service';
import { selectQueryParam, selectQueryParams } from 'ish-core/store/core/router';
import {
  applyFilter,
  loadFilterForCategory,
  loadFilterForSearch,
  loadFilterSuccess,
  loadProductsForFilter,
} from 'ish-core/store/shopping/filter';
import { getProduct, loadProductsForCategory } from 'ish-core/store/shopping/products';
import { searchProducts } from 'ish-core/store/shopping/search';
import { mapToPayload, whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import {
  loadMoreProducts,
  loadMoreProductsForParams,
  loadPagesForMaster,
  setProductListingPageSize,
  setProductListingPages,
  setViewType,
} from './product-listing.actions';
import { getProductListingView, getProductListingViewType } from './product-listing.selectors';

@Injectable()
export class ProductListingEffects {
  constructor(
    @Inject(PRODUCT_LISTING_ITEMS_PER_PAGE) private itemsPerPage: number,
    @Inject(DEFAULT_PRODUCT_LISTING_VIEW_TYPE) private defaultViewType: ViewType,
    private actions$: Actions,
    private store: Store,
    private productListingMapper: ProductListingMapper,
    private productMasterVariationsService: ProductMasterVariationsService
  ) {}

  initializePageSize$ = createEffect(() =>
    this.actions$.pipe(take(1), mapTo(setProductListingPageSize({ itemsPerPage: this.itemsPerPage })))
  );

  initializeDefaultViewType$ = createEffect(() =>
    this.store.pipe(
      select(getProductListingViewType),
      whenFalsy(),
      mapTo(setViewType({ viewType: this.defaultViewType }))
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

  determineParams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMoreProducts),
      mapToPayload(),
      switchMap(({ id, page }) =>
        this.store.pipe(
          select(selectQueryParams),
          map(params => ({
            id,
            sorting: params.sorting || undefined,
            page: +params.page || page || undefined,
            filters: params.filters || undefined,
          }))
        )
      ),
      distinctUntilChanged(isEqual),
      map(({ id, filters, sorting, page }) => loadMoreProductsForParams({ id, filters, sorting, page }))
    )
  );

  loadMoreProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMoreProductsForParams),
      mapToPayload(),
      switchMap(({ id, sorting, page, filters }) =>
        this.store.pipe(
          select(getProductListingView, { ...id, sorting, filters }),
          map(view => ({
            id,
            sorting,
            page,
            filters,
            viewAvailable: !view.empty() && view.productsOfPage(page).length,
          }))
        )
      ),
      map(({ id, sorting, page, filters, viewAvailable }) => {
        if (viewAvailable) {
          return setProductListingPages({ id: { sorting, filters, ...id } });
        }
        if (
          filters &&
          // TODO: work-around for different products/hits-result without filters
          (id.type !== 'search' || (id.type === 'search' && filters !== `&@QueryTerm=${id.value}&OnlineFlag=1`)) &&
          // TODO: work-around for client side computation of master variations
          ['search', 'category'].includes(id.type)
        ) {
          const searchParameter = b64u.toBase64(b64u.encode(filters));
          return loadProductsForFilter({ id: { ...id, filters }, searchParameter });
        } else {
          switch (id.type) {
            case 'category':
              return loadProductsForCategory({ categoryId: id.value, page, sorting });
            case 'search':
              return searchProducts({ searchTerm: id.value, page, sorting });
            case 'master':
              return loadPagesForMaster({ id, sorting, filters });
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
        if (
          filters &&
          // TODO: work-around for different products/hits-result without filters
          (type !== 'search' || (type === 'search' && filters !== `&@QueryTerm=${value}&OnlineFlag=1`)) &&
          // TODO: work-around for client side computation of master variations
          ['search', 'category'].includes(type)
        ) {
          const searchParameter = b64u.toBase64(b64u.encode(filters));
          return applyFilter({ searchParameter });
        } else {
          switch (type) {
            case 'category':
              return loadFilterForCategory({ uniqueId: value });
            case 'search':
              return loadFilterForSearch({ searchTerm: value });
            case 'master':
              return loadPagesForMaster({ id: { type, value }, sorting: undefined, filters });
            default:
              return;
          }
        }
      }),
      whenTruthy()
    )
  );

  /**
   * client side computation of master variations
   * TODO: this is a work-around
   */
  loadPagesForMaster$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPagesForMaster),
      mapToPayload(),
      switchMap(({ id, filters }) =>
        this.store.pipe(
          select(getProduct, { sku: id.value }),
          filter(p => ProductHelper.isSufficientlyLoaded(p, ProductCompletenessLevel.Detail)),
          filter(ProductHelper.hasVariations),
          filter(ProductHelper.isMasterProduct),
          take(1),
          mergeMap(product => {
            const {
              filterNavigation,
              products,
            } = this.productMasterVariationsService.getFiltersAndFilteredVariationsForMasterProduct(product, filters);

            return [
              setProductListingPages(
                this.productListingMapper.createPages(products, id.type, id.value, {
                  filters: filters ? b64u.toBase64(b64u.encode(filters)) : undefined,
                })
              ),
              loadFilterSuccess({ filterNavigation }),
            ];
          })
        )
      )
    )
  );
}
