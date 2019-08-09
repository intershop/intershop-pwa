import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';
import { FilterService } from '../../../services/filter/filter.service';
import { CategoriesActionTypes, getSelectedCategory } from '../categories';
import { SetProductListingPages } from '../product-listing';
import { LoadProductFail } from '../products';
import { SearchActionTypes, SearchProductsSuccess } from '../search';

import * as filterActions from './filter.actions';

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private filterService: FilterService,
    private productListingMapper: ProductListingMapper
  ) {}

  @Effect()
  loadAvailableFilterForCategories$ = this.actions$.pipe(
    ofType<filterActions.LoadFilterForCategory>(filterActions.FilterActionTypes.LoadFilterForCategory),
    mapToPayloadProperty('category'),
    mergeMap(category =>
      this.filterService.getFilterForCategory(category).pipe(
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
  loadFilterIfCategoryWasSelected$ = this.actions$.pipe(
    ofType(CategoriesActionTypes.SelectedCategoryAvailable),
    withLatestFrom(this.store.pipe(select(getSelectedCategory))),
    map(([, category]) => new filterActions.LoadFilterForCategory({ category }))
  );

  @Effect()
  loadFilterForSearchIfSearchSuccess$ = this.actions$.pipe(
    ofType<SearchProductsSuccess>(SearchActionTypes.SearchProductsSuccess),
    mapToPayloadProperty('searchTerm'),
    map(searchTerm => new filterActions.LoadFilterForSearch({ searchTerm }))
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
      this.filterService.getProductSkusForFilter(searchParameter).pipe(
        mergeMap(newProducts => [
          new SetProductListingPages(
            this.productListingMapper.createPages(newProducts, id.type, id.value, { filters: id.filters })
          ),
        ]),
        mapErrorToAction(LoadProductFail)
      )
    )
  );
}
