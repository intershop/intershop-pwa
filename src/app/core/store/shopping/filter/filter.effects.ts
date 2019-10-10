import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { loadProductFail } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  applyFilter,
  applyFilterFail,
  applyFilterSuccess,
  loadFilterFail,
  loadFilterForCategory,
  loadFilterForSearch,
  loadFilterSuccess,
  loadProductsForFilter,
} from './filter.actions';

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private filterService: FilterService,
    private productListingMapper: ProductListingMapper
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
        this.filterService.getFilteredProducts(searchParameter, page, sorting).pipe(
          mergeMap(({ productSKUs, total, sortKeys }) => [
            setProductListingPages(
              this.productListingMapper.createPages(productSKUs, id.type, id.value, {
                filters: id.filters,
                itemCount: total,
                startPage: page,
                sortKeys,
                sorting,
              })
            ),
          ]),
          mapErrorToAction(loadProductFail)
        )
      )
    )
  );
}
