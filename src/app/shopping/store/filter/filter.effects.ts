import { Category } from '../../../models/category/category.model';
import { FilterService } from '../../services/filter/filter.service';
import { SelectProduct } from '../products/products.actions';
import { ApplyFilterSuccess } from './filter.actions';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, distinctUntilKeyChanged, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import * as fromStore from '../../store/categories';
import * as filterActions from '../filter/filter.actions';
import { SearchActionTypes, SearchProductsSuccess } from '../search';
import { ShoppingState } from '../shopping.state';

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
        catchError(error => of(new filterActions.LoadFilterForCategoryFail(error)))
      )
    )
  );

  @Effect()
  loadFilterForSearch$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.LoadFilterForSearch),
    mergeMap((action: filterActions.LoadFilterForSearch) =>
      this.filterService.getFilterForSearch(action.payload).pipe(
        map(filterNavigation => new filterActions.LoadFilterForSearchSuccess(filterNavigation)),
        catchError(error => of(new filterActions.LoadFilterForSearchFail(error)))
      )
    )
  );

  @Effect()
  loadFilterIfCategoryWasSelected$ = this.store$.pipe(
    select(fromStore.getSelectedCategory),
    filter(category => !!category),
    distinctUntilKeyChanged('uniqueId'),
    map(
      category =>
        new filterActions.LoadFilterForCategory({
          ...category,
          children: undefined,
          hasChildren: undefined,
          pathCategories: undefined,
        } as Category)
    )
  );

  @Effect()
  loadFilterForSearchIfSearchSuccess$ = this.actions$.pipe(
    ofType(SearchActionTypes.SearchProductsSuccess),
    map((action: SearchProductsSuccess) => new filterActions.LoadFilterForSearch(action.payload.searchTerm))
  );

  @Effect()
  applyFilter$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.ApplyFilter),
    map((f: filterActions.ApplyFilter) => f.payload),
    mergeMap(emit =>
      this.filterService.applyFilter(emit.filterId, emit.searchParameter).pipe(
        map(
          filterNavigation =>
            new filterActions.ApplyFilterSuccess(filterNavigation, emit.filterId, emit.searchParameter)
        ),
        catchError(error => of(new filterActions.ApplyFilterFail(error)))
      )
    )
  );

  @Effect()
  loadFilteredProducts$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.ApplyFilterSuccess),
    switchMap((action: ApplyFilterSuccess) =>
      this.filterService.getProductSkusForFilter(action.filterName, action.searchParameter).pipe(
        mergeMap((skus: string[]) => {
          // TODO: ??
          const actions = skus.map(b => new SelectProduct(b));
          return [...actions, new filterActions.SetFilteredProducts(skus)];
        })
      )
    )
  );
}
