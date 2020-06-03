import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { LoadProductFail } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  ApplyFilter,
  ApplyFilterFail,
  ApplyFilterSuccess,
  FilterActionTypes,
  LoadFilterFail,
  LoadFilterForCategory,
  LoadFilterForSearch,
  LoadFilterSuccess,
  LoadProductsForFilter,
} from './filter.actions';

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private filterService: FilterService,
    private productListingMapper: ProductListingMapper
  ) {}

  @Effect()
  loadAvailableFilterForCategories$ = this.actions$.pipe(
    ofType<LoadFilterForCategory>(FilterActionTypes.LoadFilterForCategory),
    mapToPayloadProperty('uniqueId'),
    mergeMap(uniqueId =>
      this.filterService.getFilterForCategory(uniqueId).pipe(
        map(filterNavigation => new LoadFilterSuccess({ filterNavigation })),
        mapErrorToAction(LoadFilterFail)
      )
    )
  );

  @Effect()
  loadFilterForSearch$ = this.actions$.pipe(
    ofType<LoadFilterForSearch>(FilterActionTypes.LoadFilterForSearch),
    mapToPayloadProperty('searchTerm'),
    mergeMap(searchTerm =>
      this.filterService.getFilterForSearch(searchTerm).pipe(
        map(filterNavigation => new LoadFilterSuccess({ filterNavigation })),
        mapErrorToAction(LoadFilterFail)
      )
    )
  );

  @Effect()
  applyFilter$ = this.actions$.pipe(
    ofType<ApplyFilter>(FilterActionTypes.ApplyFilter),
    mapToPayload(),
    mergeMap(({ searchParameter }) =>
      this.filterService.applyFilter(searchParameter).pipe(
        map(availableFilter => new ApplyFilterSuccess({ availableFilter, searchParameter })),
        mapErrorToAction(ApplyFilterFail)
      )
    )
  );

  @Effect()
  loadFilteredProducts$ = this.actions$.pipe(
    ofType<LoadProductsForFilter>(FilterActionTypes.LoadProductsForFilter),
    mapToPayload(),
    switchMap(({ id, searchParameter }) =>
      this.filterService.getFilteredProducts(searchParameter).pipe(
        mergeMap(({ productSKUs, total }) => [
          new SetProductListingPages(
            this.productListingMapper.createPages(productSKUs, id.type, id.value, {
              filters: id.filters,
              itemCount: total,
            })
          ),
        ]),
        mapErrorToAction(LoadProductFail)
      )
    )
  );
}
