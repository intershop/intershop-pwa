import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { LoadProductFail } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import * as filterActions from './filter.actions';

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private filterService: FilterService,
    private productListingMapper: ProductListingMapper
  ) {}

  @Effect()
  loadAvailableFilterForCategories$ = this.actions$.pipe(
    ofType<filterActions.LoadFilterForCategory>(filterActions.FilterActionTypes.LoadFilterForCategory),
    mapToPayloadProperty('uniqueId'),
    mergeMap(uniqueId =>
      this.filterService.getFilterForCategory(uniqueId).pipe(
        map(filterNavigation => new filterActions.LoadFilterSuccess({ filterNavigation })),
        mapErrorToAction(filterActions.LoadFilterFail)
      )
    )
  );

  @Effect()
  loadFilterForSearch$ = this.actions$.pipe(
    ofType<filterActions.LoadFilterForSearch>(filterActions.FilterActionTypes.LoadFilterForSearch),
    mapToPayloadProperty('searchTerm'),
    mergeMap(searchTerm =>
      this.filterService.getFilterForSearch(searchTerm).pipe(
        map(filterNavigation => new filterActions.LoadFilterSuccess({ filterNavigation })),
        mapErrorToAction(filterActions.LoadFilterFail)
      )
    )
  );

  @Effect()
  applyFilter$ = this.actions$.pipe(
    ofType<filterActions.ApplyFilter>(filterActions.FilterActionTypes.ApplyFilter),
    mapToPayload(),
    mergeMap(({ searchParameter }) =>
      this.filterService.applyFilter(searchParameter).pipe(
        map(availableFilter => new filterActions.ApplyFilterSuccess({ availableFilter, searchParameter })),
        mapErrorToAction(filterActions.ApplyFilterFail)
      )
    )
  );

  @Effect()
  loadFilteredProducts$ = this.actions$.pipe(
    ofType<filterActions.LoadProductsForFilter>(filterActions.FilterActionTypes.LoadProductsForFilter),
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
