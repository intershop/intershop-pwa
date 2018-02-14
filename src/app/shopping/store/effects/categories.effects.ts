import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { ProductsService } from '../../services/products/products.service';
import * as categoriesReducers from '../../store/reducers/categories.reducer';
import * as categoriesActions from '../actions/categories.actions';
import * as productsActions from '../actions/products.actions';
import * as categoriesSelectors from '../selectors/categories.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<categoriesReducers.CategoriesState>,
    private categoryService: CategoriesService,
    private productsService: ProductsService
  ) { }

  @Effect()
  selectedCategory$ = this.store.select(categoriesSelectors.getSelectedCategoryId).pipe(
    filter(id => !!id),
    switchMap(id => {
      return this.store.select(categoriesSelectors.getCategoryEntities).pipe(
        take(1),
        map(entities => entities[id]),
        map(entity => {
          if (entity && entity.hasOnlineSubCategories && !!entity.subCategories) {
            return new categoriesActions.LoadCategorySuccess(entity);
          } else {
            return new categoriesActions.LoadCategory(id);
          }
        }
        )
      );
    })
  );

  @Effect()
  loadCategory$ = this.actions$.pipe(
    ofType(categoriesActions.LOAD_CATEGORY),
    map((action: categoriesActions.LoadCategory) => action.payload),
    mergeMap(categoryUniqueId => {
      return this.categoryService.getCategory(categoryUniqueId).pipe(
        // delay(2000), // DEBUG
        map(category => new categoriesActions.LoadCategorySuccess(category)),
        catchError(error => of(new categoriesActions.LoadCategoryFail(error)))
      );
    })
  );

  @Effect()
  loadProductsForCategory$ = this.store.select(categoriesSelectors.getSelectedCategory).pipe(
    filter(c => c && c.hasOnlineProducts && !c.productSkus),
    concatMap(c => this.productsService.getProductSkuListForCategory(c.uniqueId)),
    switchMap(res => [
      new categoriesActions.SetProductSkusForCategory(res.categoryUniqueId, res.skus),
      ...res.skus.map(sku => new productsActions.LoadProduct(sku)),
    ])
  );

  // TODO: @Ferdinand: non full categories might not be to helpfull
  @Effect()
  saveSubCategories$ = this.actions$.pipe(
    ofType(categoriesActions.LOAD_CATEGORY_SUCCESS),
    map((action: categoriesActions.LoadCategorySuccess) => action.payload.subCategories),
    filter(sc => !!sc),
    map(sc => new categoriesActions.SaveSubCategories(sc))
  );
}
