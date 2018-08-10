import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE, RouteNavigation, ofRoute } from 'ngrx-router';
import { combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMapTo,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from '../../../core/configurations/injection-keys';
import { CoreState } from '../../../core/store/core.state';
import { CategoryHelper } from '../../../models/category/category.model';
import { distinctCompareWith, mapErrorToAction } from '../../../utils/operators';
import { CategoriesService } from '../../services/categories/categories.service';
import { LoadProductsForCategory } from '../products';
import { ShoppingState } from '../shopping.state';
import { getVisibleProducts } from '../viewconf';

import * as actions from './categories.actions';
import * as selectors from './categories.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState | CoreState>,
    private categoryService: CategoriesService,
    private router: Router,
    @Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH) private mainNavigationMaxSubCategoriesDepth: number
  ) {}

  /**
   * listens to routing and fires {@link SelectCategory} if a category route is selected
   * and {@link DeselectCategory} if deselected
   */
  @Effect()
  routeListenerForSelectingCategory$ = this.actions$.pipe(
    ofType<RouteNavigation>(ROUTER_NAVIGATION_TYPE),
    map(action => action.payload.params.categoryUniqueId),
    distinctCompareWith(this.store.pipe(select(selectors.getSelectedCategoryId))),
    map(
      categoryUniqueId =>
        !!categoryUniqueId ? new actions.SelectCategory(categoryUniqueId) : new actions.DeselectCategory()
    )
  );

  /**
   * listens to {@link SelectCategory} actions and fires {@link LoadCategory}
   * when the requested {@link Category} is not available
   */
  @Effect()
  selectedCategory$ = this.actions$.pipe(
    ofType(actions.CategoriesActionTypes.SelectCategory),
    map((action: actions.SelectCategory) => action.payload),
    withLatestFrom(this.store.pipe(select(selectors.getCategoryEntities))),
    filter(([id, entities]) => !CategoryHelper.isCategoryCompletelyLoaded(entities[id])),
    map(([id]) => new actions.LoadCategory(id))
  );

  /**
   * fires {@link SelectedCategoryAvailable} when the requested {@link Category} is completely loaded
   */
  @Effect()
  selectedCategoryAvailable$ = combineLatest(
    this.actions$.pipe(
      ofType(actions.CategoriesActionTypes.SelectCategory),
      map((action: actions.SelectCategory) => action.payload)
    ),
    this.store.pipe(select(selectors.getSelectedCategory), filter(CategoryHelper.isCategoryCompletelyLoaded))
  ).pipe(
    filter(([selectId, category]) => selectId === category.uniqueId),
    distinctUntilChanged((x, y) => x[0] === y[0]),
    map(x => new actions.SelectedCategoryAvailable(x[0]))
  );

  /**
   * fires {@link LoadCategory} for category path categories of the selected category that are not yet completely loaded
   */
  @Effect()
  loadCategoriesOfCategoryPath$ = this.actions$.pipe(
    ofType(actions.CategoriesActionTypes.SelectedCategoryAvailable),
    withLatestFrom(this.store.pipe(select(selectors.getSelectedCategory))),
    map(([, category]) => category.categoryPath),
    withLatestFrom(this.store.pipe(select(selectors.getCategoryEntities))),
    map(([ids, entities]) => ids.filter(id => !CategoryHelper.isCategoryCompletelyLoaded(entities[id]))),
    mergeMap(ids => ids.map(id => new actions.LoadCategory(id)))
  );

  /**
   * loads a {@link Category} using the {@link CategoriesService}
   */
  @Effect()
  loadCategory$ = this.actions$.pipe(
    ofType(actions.CategoriesActionTypes.LoadCategory),
    map((action: actions.LoadCategory) => action.payload),
    mergeMap(categoryUniqueId =>
      this.categoryService.getCategory(categoryUniqueId).pipe(
        map(category => new actions.LoadCategorySuccess(category)),
        mapErrorToAction(actions.LoadCategoryFail)
      )
    )
  );

  @Effect()
  loadTopLevelWhenUnavailable$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    take(1),
    switchMapTo(this.store.pipe(select(selectors.isTopLevelCategoriesLoaded), filter(loaded => !loaded))),
    mapTo(new actions.LoadTopLevelCategories(this.mainNavigationMaxSubCategoriesDepth))
  );

  @Effect()
  loadTopLevelCategories$ = this.actions$.pipe(
    ofType<actions.LoadTopLevelCategories>(actions.CategoriesActionTypes.LoadTopLevelCategories),
    map(action => action.payload),
    mergeMap(limit =>
      this.categoryService.getTopLevelCategories(limit).pipe(
        map(category => new actions.LoadTopLevelCategoriesSuccess(category)),
        mapErrorToAction(actions.LoadTopLevelCategoriesFail)
      )
    )
  );

  /**
   * Trigger {@link LoadProductsForCategory} if we are on a family page
   * and the corresponding products were not yet loaded.
   */
  @Effect()
  productOrCategoryChanged$ = combineLatest(
    this.store.pipe(select(selectors.getSelectedCategory), filter(x => !!x), distinctUntilKeyChanged('uniqueId')),
    this.actions$.pipe<RouteNavigation>(ofRoute('category/:categoryUniqueId'))
  ).pipe(
    filter(([category, action]) => category.uniqueId === action.payload.params.categoryUniqueId),
    withLatestFrom(this.store.pipe(select(getVisibleProducts))),
    filter(([[category], skus]) => category && category.hasOnlineProducts && !skus.length),
    map(([[category]]) => new LoadProductsForCategory(category.uniqueId))
  );

  @Effect({ dispatch: false })
  redirectIfErrorInCategories$ = this.actions$.pipe(
    ofType(actions.CategoriesActionTypes.LoadCategoryFail),
    tap(() => this.router.navigate(['/error']))
  );
}
