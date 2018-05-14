import { FilterService } from '../../services/filter/filter.service';
import { LoadProduct } from '../products/products.actions';
import { ApplyFilterSuccess } from './filter.actions';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import * as fromStore from '../../store/categories';
import * as categoryActions from '../categories/categories.actions';
import * as filterActions from '../filter/filter.actions';
import { ShoppingState } from '../shopping.state';

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState | CoreState>,
    private filterService: FilterService
  ) {}

  @Effect()
  loadAvailableFilterForCategories$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.LoadFilterForCategory),

    mergeMap((action: filterActions.LoadFilterForCategory) =>
      this.filterService
        .changeToFilterForCategory(action.payload.parent, action.payload.category)
        .pipe(
          map(filter => new filterActions.LoadFilterForCategorySuccess(filter)),
          catchError(error => of(new filterActions.LoadFilterForCategoryFail(error)))
        )
    )
  );

  @Effect()
  loadFilterIfCategoryWasSelected$ = this.actions$.pipe(
    ofType(categoryActions.CategoriesActionTypes.SelectCategory),

    withLatestFrom(this.store.pipe(select(fromStore.getSelectedCategoryPath))),
    map(actionPair => actionPair['1']),
    map(
      categories =>
        new filterActions.LoadFilterForCategory({
          parent: categories[0].id,
          category: categories[categories.length - 1].id,
        })
    )
  );

  @Effect()
  applyFilter$ = this.actions$.pipe(
    ofType(filterActions.FilterActionTypes.ApplyFilter),
    map((f: filterActions.ApplyFilter) => f.payload),
    mergeMap(queryParam =>
      this.filterService
        .applyFilter(queryParam[0], queryParam[1])
        .pipe(
          map(filter => new filterActions.ApplyFilterSuccess(filter, queryParam[0], queryParam[1])),
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
          const actions = skus.map(b => new LoadProduct(b));
          return [...actions, new filterActions.SetFilteredProducts(skus)];
        })
      )
    )
  );
}
