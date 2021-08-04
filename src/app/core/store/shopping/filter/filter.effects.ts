import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { first, map, mergeMap, switchMap } from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { Product } from 'ish-core/models/product/product.model';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { getProductListingItemsPerPage, setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { loadProductFail, loadProductSuccess } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

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

  loadAvailableFilterForCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFilterForCategory),
      mapToPayloadProperty('uniqueId'),
      mergeMap(uniqueId =>
        this.filterService.getFilterForCategory(uniqueId).pipe(
          map(filterNavigation => loadFilterSuccess({ filterNavigation })),
          mapErrorToAction(loadFilterFail)
        )
      )
    )
  );

  loadFilterForSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFilterForSearch),
      mapToPayloadProperty('searchTerm'),
      mergeMap(searchTerm =>
        this.filterService.getFilterForSearch(searchTerm).pipe(
          map(filterNavigation => loadFilterSuccess({ filterNavigation })),
          mapErrorToAction(loadFilterFail)
        )
      )
    )
  );

  loadFilterForMaster$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFilterForMaster),
      mapToPayloadProperty('masterSKU'),
      mergeMap(masterSKU =>
        this.filterService.getFilterForMaster(masterSKU).pipe(
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
