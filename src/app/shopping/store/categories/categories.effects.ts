import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import * as productsActions from '../products/products.actions';
import * as productsSelectors from '../products/products.selectors';
import { ShoppingState } from '../shopping.state';
import * as categoriesActions from './categories.actions';
import * as categoriesSelectors from './categories.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
    private categoryService: CategoriesService
  ) { }

  @Effect()
  selectedCategory$ = this.store.pipe(
    select(categoriesSelectors.getSelectedCategoryId),
    filter(id => !!id),
    withLatestFrom(this.store.pipe(select(categoriesSelectors.getSelectedCategory))),
    filter(([id, c]) => !c || (c.hasOnlineSubCategories && !c.subCategories)),
    map(([id, c]) => new categoriesActions.LoadCategory(id))
  );

  @Effect()
  loadCategory$ = this.actions$.pipe(
    ofType(categoriesActions.CategoriesActionTypes.LoadCategory),
    map((action: categoriesActions.LoadCategory) => action.payload),
    mergeMap(categoryUniqueId => {
      return this.categoryService.getCategory(categoryUniqueId).pipe(
        map(category => new categoriesActions.LoadCategorySuccess(category)),
        catchError(error => of(new categoriesActions.LoadCategoryFail(error)))
      );
    })
  );

  @Effect()
  productOrCategoryChanged$ = combineLatest(
    this.store.pipe(select(categoriesSelectors.getSelectedCategory)),
    this.store.pipe(select(productsSelectors.getSelectedProductId)),
  ).pipe(
    filter(([c, selectedProductSku]) => !selectedProductSku),
    filter(([c, sku]) => !sku && c && c.hasOnlineProducts && !c.productSkus),
    map(([c, sku]) => new productsActions.LoadProductsForCategory(c.uniqueId))
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
