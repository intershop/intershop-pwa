import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { first, map, mergeMap, switchMap } from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { Product } from 'ish-core/models/product/product.model';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { getProductListingItemsPerPage, setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { loadProductFail, loadProductSuccess } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, whenTruthy } from 'ish-core/utils/operators';

import {
  applyFilter,
  applyFilterFail,
  applyFilterSuccess,
  loadFilterFail,
  loadFilterForCategory,
  loadFilterForMaster,
  loadFilterForSearch,
  loadFilterSuccess,
  loadProductsForFilter,
} from './filter.actions';

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private filterService: FilterService,
    private productListingMapper: ProductListingMapper,
    private store: Store
  ) {}

  loadAvailableFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFilterForCategory, loadFilterForSearch, loadFilterForMaster),
      map(action => {
        switch (action.type) {
          case loadFilterForCategory.type:
            return this.filterService.getFilterForCategory(action.payload.uniqueId);
          case loadFilterForSearch.type:
            return this.filterService.getFilterForSearch(action.payload.searchTerm);
          case loadFilterForMaster.type:
            return this.filterService.getFilterForMaster(action.payload.masterSKU);
        }
      }),
      switchMap(observable$ =>
        observable$.pipe(
          map(filterNavigation => loadFilterSuccess({ filterNavigation })),
          mapErrorToAction(loadFilterFail)
        )
      )
    )
  );

  applyFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyFilter),
      mapToPayload(),
      mergeMap(({ searchParameter }) =>
        this.filterService.applyFilter(searchParameter).pipe(
          map(availableFilter => applyFilterSuccess({ availableFilter, searchParameter })),
          mapErrorToAction(applyFilterFail)
        )
      )
    )
  );

  loadFilteredProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductsForFilter),
      mapToPayload(),
      switchMap(({ id, searchParameter, page, sorting }) =>
        this.store.pipe(
          select(getProductListingItemsPerPage(id.type)),
          whenTruthy(),
          first(),
          switchMap(pageSize =>
            this.filterService
              .getFilteredProducts(searchParameter, pageSize, sorting, ((page || 1) - 1) * pageSize)
              .pipe(
                mergeMap(({ products, total, sortableAttributes }) => [
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
                ]),
                mapErrorToAction(loadProductFail)
              )
          )
        )
      )
    )
  );
}
