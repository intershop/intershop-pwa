import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { distinctUntilKeyChanged, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { mapErrorToAction } from '../../../utils/operators';
import { FilterService } from '../../services/filter/filter.service';
import { getSelectedCategory } from '../categories';
import { LoadProduct } from '../products/products.actions';
import { SearchActionTypes, SearchProductsSuccess } from '../search';
import { ShoppingState } from '../shopping.state';
import * as filterActions from './filter.actions';

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<ShoppingState | CoreState>,
    private filterService: FilterService
  ) {}

  @Effect()
  loadAvailableFilterForCategories$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.LoadFilterForCategory),
    mergeMap((action: filterActions.LoadFilterForCategory) =>
      this.filterService.getFilterForCategory(action.payload).pipe(
        map(filterNavigation => new filterActions.LoadFilterForCategorySuccess(filterNavigation)),
        mapErrorToAction(filterActions.LoadFilterForCategoryFail)
      )
    )
  );

  @Effect()
  loadFilterForSearch$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.LoadFilterForSearch),
    mergeMap((action: filterActions.LoadFilterForSearch) =>
      this.filterService.getFilterForSearch(action.payload).pipe(
        map(filterNavigation => new filterActions.LoadFilterForSearchSuccess(filterNavigation)),
        mapErrorToAction(filterActions.LoadFilterForSearchFail)
      )
    )
  );

  @Effect()
  loadFilterIfCategoryWasSelected$ = this.store$.pipe(
    select(getSelectedCategory),
    filter(category => !!category),
    distinctUntilKeyChanged('uniqueId'),
    map(category => new filterActions.LoadFilterForCategory(category))
  );

  @Effect()
  loadFilterForSearchIfSearchSuccess$ = this.actions$.pipe(
    ofType(SearchActionTypes.SearchProductsSuccess),
    map((action: SearchProductsSuccess) => new filterActions.LoadFilterForSearch(action.payload.searchTerm))
  );

  @Effect()
  applyFilter$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.ApplyFilter),
    map((action: filterActions.ApplyFilter) => action.payload),
    mergeMap(({ filterId: filterName, searchParameter }) =>
      this.filterService.applyFilter(filterName, searchParameter).pipe(
        map(availableFilter => new filterActions.ApplyFilterSuccess({ availableFilter, filterName, searchParameter })),
        mapErrorToAction(filterActions.ApplyFilterFail)
      )
    )
  );

  @Effect()
  loadFilteredProducts$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.ApplyFilterSuccess),
    map((action: filterActions.ApplyFilterSuccess) => action.payload),
    switchMap(({ filterName, searchParameter }) =>
      this.filterService
        .getProductSkusForFilter(filterName, searchParameter)
        .pipe(
          mergeMap((skus: string[]) => [
            ...skus.map(sku => new LoadProduct(sku)),
            new filterActions.SetFilteredProducts(skus),
          ])
        )
    )
  );
}
