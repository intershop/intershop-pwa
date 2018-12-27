import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';
import { FilterService } from '../../../services/filter/filter.service';
import { CategoriesActionTypes, getSelectedCategory } from '../categories';
import { LoadProduct } from '../products/products.actions';
import { SearchActionTypes, SearchProductsSuccess } from '../search';
import { SetPagingInfo } from '../viewconf';

import * as filterActions from './filter.actions';

@Injectable()
export class FilterEffects {
  constructor(private actions$: Actions, private store$: Store<{}>, private filterService: FilterService) {}

  @Effect()
  loadAvailableFilterForCategories$ = this.actions$.pipe(
    ofType<filterActions.LoadFilterForCategory>(filterActions.FilterActionTypes.LoadFilterForCategory),
    mapToPayloadProperty('category'),
    mergeMap(category =>
      this.filterService.getFilterForCategory(category).pipe(
        map(filterNavigation => new filterActions.LoadFilterForCategorySuccess({ filterNavigation })),
        mapErrorToAction(filterActions.LoadFilterForCategoryFail)
      )
    )
  );

  @Effect()
  loadFilterForSearch$ = this.actions$.pipe(
    ofType<filterActions.LoadFilterForSearch>(filterActions.FilterActionTypes.LoadFilterForSearch),
    mapToPayloadProperty('searchTerm'),
    mergeMap(searchTerm =>
      this.filterService.getFilterForSearch(searchTerm).pipe(
        map(filterNavigation => new filterActions.LoadFilterForSearchSuccess({ filterNavigation })),
        mapErrorToAction(filterActions.LoadFilterForSearchFail)
      )
    )
  );

  @Effect()
  loadFilterIfCategoryWasSelected$ = this.actions$.pipe(
    ofType(CategoriesActionTypes.SelectedCategoryAvailable),
    withLatestFrom(this.store$.pipe(select(getSelectedCategory))),
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
    mergeMap(({ filterId: filterName, searchParameter }) =>
      this.filterService.applyFilter(filterName, searchParameter).pipe(
        map(availableFilter => new filterActions.ApplyFilterSuccess({ availableFilter, filterName, searchParameter })),
        mapErrorToAction(filterActions.ApplyFilterFail)
      )
    )
  );

  @Effect()
  loadFilteredProducts$ = this.actions$.pipe(
    ofType<filterActions.ApplyFilterSuccess>(filterActions.FilterActionTypes.ApplyFilterSuccess),
    mapToPayload(),
    switchMap(({ filterName, searchParameter }) =>
      this.filterService
        .getProductSkusForFilter(filterName, searchParameter)
        .pipe(
          mergeMap((newProducts: string[]) => [
            ...newProducts.map(sku => new LoadProduct({ sku })),
            new SetPagingInfo({ currentPage: 0, totalItems: newProducts.length, newProducts }),
          ])
        )
    )
  );
}
