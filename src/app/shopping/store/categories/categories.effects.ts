import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ofRoute, RouteNavigation } from 'ngrx-router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from '../../../core/configurations/injection-keys';
import { CoreState } from '../../../core/store/core.state';
import { LocaleActionTypes, SelectLocale } from '../../../core/store/locale';
import { CategoryHelper } from '../../../models/category/category.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { LoadProductsForCategory } from '../products';
import { ShoppingState } from '../shopping.state';
import * as categoriesActions from './categories.actions';
import * as categoriesSelectors from './categories.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState | CoreState>,
    private categoryService: CategoriesService,
    private router: Router,
    @Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH) private mainNavigationMaxSubCategoriesDepth: number
  ) {}

  @Effect()
  routeListenerForSelectingCategory$ = this.actions$.pipe(
    ofRoute(['category/:categoryUniqueId', 'category/:categoryUniqueId/product/:sku']),
    map((action: RouteNavigation) => action.payload.params['categoryUniqueId']),
    withLatestFrom(this.store.pipe(select(categoriesSelectors.getSelectedCategoryId))),
    filter(([fromAction, fromStore]) => fromAction !== fromStore),
    map(([categoryUniqueId, old]) => new categoriesActions.SelectCategory(categoryUniqueId))
  );

  @Effect()
  selectedCategory$ = this.actions$.pipe(
    ofType(categoriesActions.CategoriesActionTypes.SelectCategory),
    map((action: categoriesActions.SelectCategory) => action.payload),
    filter(id => !!id),
    map(CategoryHelper.getCategoryPathUniqueIds),
    withLatestFrom(this.store.pipe(select(categoriesSelectors.getCategoryEntities))),
    map(([ids, entities]) => ids.filter(id => !CategoryHelper.isCategoryCompletelyLoaded(entities[id]))),
    mergeMap(ids => ids.map(id => new categoriesActions.LoadCategory(id)))
  );

  @Effect()
  loadCategory$ = this.actions$.pipe(
    ofType(categoriesActions.CategoriesActionTypes.LoadCategory),
    map((action: categoriesActions.LoadCategory) => action.payload),
    mergeMap(categoryUniqueId => {
      return this.categoryService
        .getCategory(categoryUniqueId)
        .pipe(
          map(category => new categoriesActions.LoadCategorySuccess(category)),
          catchError(error => of(new categoriesActions.LoadCategoryFail(error)))
        );
    })
  );

  @Effect()
  loadTopLevelCategoriesOnLanguageChange$ = this.actions$.pipe(
    ofType(LocaleActionTypes.SelectLocale),
    map((action: SelectLocale) => action.payload),
    filter(locale => !!locale && !!locale.lang),
    distinctUntilChanged(),
    map(() => new categoriesActions.LoadTopLevelCategories(this.mainNavigationMaxSubCategoriesDepth))
  );

  @Effect()
  loadTopLevelCategories$ = this.actions$.pipe(
    ofType(categoriesActions.CategoriesActionTypes.LoadTopLevelCategories),
    map((action: categoriesActions.LoadTopLevelCategories) => action.payload),
    mergeMap(limit => {
      return this.categoryService
        .getTopLevelCategories(limit)
        .pipe(
          map(category => new categoriesActions.LoadTopLevelCategoriesSuccess(category)),
          catchError(error => of(new categoriesActions.LoadTopLevelCategoriesFail(error)))
        );
    })
  );

  /**
   * trigger LoadProductsForCategory if we are on a family page
   * and the corresponding products were not yet loaded
   */
  @Effect()
  productOrCategoryChanged$ = combineLatest(
    this.store.pipe(select(categoriesSelectors.productsForSelectedCategoryAreNotLoaded)),
    this.actions$.pipe(ofRoute('category/:categoryUniqueId'))
  ).pipe(
    filter(([needed, correctPath]) => !!needed && !!correctPath),
    switchMap(() => this.store.pipe(select(categoriesSelectors.getSelectedCategoryId))),
    map(uniqueId => new LoadProductsForCategory(uniqueId))
  );

  @Effect({ dispatch: false })
  redirectIfErrorInCategories$ = this.actions$.pipe(
    ofType(categoriesActions.CategoriesActionTypes.LoadCategoryFail),
    tap(() => this.router.navigate(['/error']))
  );

  // TODO: @Ferdinand: non full categories might not be to helpfull
  @Effect()
  saveSubCategories$ = this.actions$.pipe(
    ofType(categoriesActions.CategoriesActionTypes.LoadCategorySuccess),
    map((action: categoriesActions.LoadCategorySuccess) => action.payload.subCategories),
    filter(sc => !!sc),
    map(sc => new categoriesActions.SaveSubCategories(sc))
  );
}
