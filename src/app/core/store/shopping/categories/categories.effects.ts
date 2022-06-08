import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { from } from 'rxjs';
import { concatMap, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { CategoryHelper } from 'ish-core/models/category/category.model';
import { ofCategoryUrl } from 'ish-core/routing/category/category.route';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { loadMoreProducts } from 'ish-core/store/shopping/product-listing';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  mapErrorToAction,
  mapToPayloadProperty,
  useCombinedObservableOnAction,
  whenTruthy,
} from 'ish-core/utils/operators';

import {
  loadCategory,
  loadCategoryByRef,
  loadCategoryFail,
  loadCategorySuccess,
  loadTopLevelCategories,
  loadTopLevelCategoriesFail,
  loadTopLevelCategoriesSuccess,
} from './categories.actions';
import {
  getBreadcrumbForCategoryPage,
  getCategoryEntities,
  getCategoryRefs,
  getSelectedCategory,
} from './categories.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private categoryService: CategoriesService,
    @Inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH) private mainNavigationMaxSubCategoriesDepth: number,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  /**
   * listens to routing and fires {@link LoadCategory}
   * when the requested {@link Category} is not available, yet
   */
  selectedCategory$ = createEffect(() =>
    this.actions$.pipe(
      useCombinedObservableOnAction(
        this.store.pipe(select(selectRouteParam('categoryUniqueId'))),
        personalizationStatusDetermined
      ),
      whenTruthy(),
      withLatestFrom(this.store.pipe(select(getCategoryEntities))),
      filter(([id, entities]) => !CategoryHelper.isCategoryCompletelyLoaded(entities[id])),
      map(([categoryId]) => loadCategory({ categoryId }))
    )
  );

  /**
   * listens to routing and fires {@link loadCategoryByRef}
   * when the requested ref in {@link getCategoryRefs} is not available, yet
   */
  selectedCategoryRef$ = createEffect(() =>
    this.actions$.pipe(
      useCombinedObservableOnAction(
        this.store.pipe(select(selectRouteParam('categoryRefId'))),
        personalizationStatusDetermined
      ),
      whenTruthy(),
      withLatestFrom(this.store.pipe(select(getCategoryRefs)), this.store.pipe(select(getCategoryEntities))),
      filter(
        ([id, refs, entities]) =>
          !refs[id] || (refs[id] && !CategoryHelper.isCategoryCompletelyLoaded(entities[refs[id]]))
      ),
      map(([categoryId]) => loadCategoryByRef({ categoryId }))
    )
  );

  /**
   * loads a {@link Category} using the {@link CategoriesService}
   */
  loadCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCategory, loadCategoryByRef),
      mapToPayloadProperty('categoryId'),
      mergeMap(id =>
        this.categoryService.getCategory(id).pipe(
          map(categories => loadCategorySuccess({ categories })),
          mapErrorToAction(loadCategoryFail)
        )
      )
    )
  );

  loadTopLevelCategories$ = createEffect(() =>
    this.actions$.pipe(
      useCombinedObservableOnAction(
        this.actions$.pipe(ofType(loadTopLevelCategories)),
        personalizationStatusDetermined
      ),
      switchMap(() =>
        this.categoryService.getTopLevelCategories(this.mainNavigationMaxSubCategoriesDepth).pipe(
          map(categories => loadTopLevelCategoriesSuccess({ categories })),
          mapErrorToAction(loadTopLevelCategoriesFail)
        )
      )
    )
  );

  productOrCategoryChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMap(() =>
        this.store.pipe(
          ofCategoryUrl(),
          select(getSelectedCategory),
          whenTruthy(),
          filter(cat => cat.hasOnlineProducts),
          map(({ uniqueId }) => loadMoreProducts({ id: { type: 'category', value: uniqueId } }))
        )
      )
    )
  );

  redirectIfErrorInCategories$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadCategoryFail),
        concatMap(() => from(this.httpStatusCodeService.setStatus(404)))
      ),
    { dispatch: false }
  );

  setBreadcrumbForCategoryPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMap(() =>
        this.store.pipe(
          ofCategoryUrl(),
          select(getBreadcrumbForCategoryPage),
          whenTruthy(),
          map(breadcrumbData => setBreadcrumbData({ breadcrumbData }))
        )
      )
    )
  );
}
