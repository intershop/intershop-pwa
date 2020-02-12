import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { mapToParam, ofRoute } from 'ngrx-router';
import { combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  switchMapTo,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { CategoryHelper } from 'ish-core/models/category/category.model';
import { ofCategoryRoute } from 'ish-core/routing/category/category.route';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { LoadMoreProducts } from 'ish-core/store/shopping/product-listing';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  distinctCompareWith,
  mapErrorToAction,
  mapToPayloadProperty,
  whenFalsy,
  whenTruthy,
} from 'ish-core/utils/operators';

import * as actions from './categories.actions';
import * as selectors from './categories.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private categoryService: CategoriesService,
    @Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH) private mainNavigationMaxSubCategoriesDepth: number,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  /**
   * listens to routing and fires {@link SelectCategory} if a category route is selected
   * and {@link DeselectCategory} if deselected
   */
  @Effect()
  routeListenerForSelectingCategory$ = this.actions$.pipe(
    ofRoute(),
    mapToParam<string>('categoryUniqueId'),
    distinctCompareWith(this.store.pipe(select(selectors.getSelectedCategoryId))),
    map(categoryId => (categoryId ? new actions.SelectCategory({ categoryId }) : new actions.DeselectCategory()))
  );

  /**
   * listens to {@link SelectCategory} actions and fires {@link LoadCategory}
   * when the requested {@link Category} is not available
   */
  @Effect()
  selectedCategory$ = this.actions$.pipe(
    ofType<actions.SelectCategory>(actions.CategoriesActionTypes.SelectCategory),
    mapToPayloadProperty('categoryId'),
    withLatestFrom(this.store.pipe(select(selectors.getCategoryEntities))),
    filter(([id, entities]) => !CategoryHelper.isCategoryCompletelyLoaded(entities[id])),
    map(([categoryId]) => new actions.LoadCategory({ categoryId }))
  );

  /**
   * fires {@link SelectedCategoryAvailable} when the requested {@link Category} is completely loaded
   */
  @Effect()
  selectedCategoryAvailable$ = combineLatest([
    this.actions$.pipe(
      ofType<actions.SelectCategory>(actions.CategoriesActionTypes.SelectCategory),
      mapToPayloadProperty('categoryId')
    ),
    this.store.pipe(
      select(selectors.getSelectedCategory),
      filter(CategoryHelper.isCategoryCompletelyLoaded)
    ),
  ]).pipe(
    filter(([selectId, category]) => selectId === category.uniqueId),
    distinctUntilChanged((x, y) => x[0] === y[0]),
    map(([categoryId]) => new actions.SelectedCategoryAvailable({ categoryId }))
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
    mergeMap(ids => ids.map(categoryId => new actions.LoadCategory({ categoryId })))
  );

  /**
   * loads a {@link Category} using the {@link CategoriesService}
   */
  @Effect()
  loadCategory$ = this.actions$.pipe(
    ofType<actions.LoadCategory>(actions.CategoriesActionTypes.LoadCategory),
    mapToPayloadProperty('categoryId'),
    mergeMap(categoryUniqueId =>
      this.categoryService.getCategory(categoryUniqueId).pipe(
        map(categories => new actions.LoadCategorySuccess({ categories })),
        mapErrorToAction(actions.LoadCategoryFail)
      )
    )
  );

  @Effect()
  loadTopLevelWhenUnavailable$ = this.actions$.pipe(
    ofRoute(),
    switchMapTo(this.store.pipe(select(selectors.isTopLevelCategoriesLoaded))),
    whenFalsy(),
    mapTo(new actions.LoadTopLevelCategories({ depth: this.mainNavigationMaxSubCategoriesDepth }))
  );

  @Effect()
  loadTopLevelCategories$ = this.actions$.pipe(
    ofType<actions.LoadTopLevelCategories>(actions.CategoriesActionTypes.LoadTopLevelCategories),
    mapToPayloadProperty('depth'),
    switchMap(limit =>
      this.categoryService.getTopLevelCategories(limit).pipe(
        map(categories => new actions.LoadTopLevelCategoriesSuccess({ categories })),
        mapErrorToAction(actions.LoadTopLevelCategoriesFail)
      )
    )
  );

  @Effect()
  productOrCategoryChanged$ = this.actions$.pipe(
    ofCategoryRoute(),
    mapToParam('sku'),
    whenFalsy(),
    switchMap(() => this.store.pipe(select(selectors.getSelectedCategory))),
    whenTruthy(),
    filter(cat => cat.hasOnlineProducts),
    map(({ uniqueId }) => new LoadMoreProducts({ id: { type: 'category', value: uniqueId } }))
  );

  @Effect({ dispatch: false })
  redirectIfErrorInCategories$ = this.actions$.pipe(
    ofType(actions.CategoriesActionTypes.LoadCategoryFail),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
  );
}
