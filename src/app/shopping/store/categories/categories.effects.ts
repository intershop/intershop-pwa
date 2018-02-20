import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { ProductsService } from '../../services/products/products.service';
import * as productsActions from '../products/products.actions';
import * as productsSelectors from '../products/products.selectors';
import { ShoppingState } from '../shopping.state';
import * as categoriesActions from './categories.actions';
import { CategoriesActionTypes } from './categories.actions';
import * as categoriesSelectors from './categories.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
    private categoryService: CategoriesService,
    private productsService: ProductsService
  ) { }

  @Effect()
  selectedCategory$ = this.store.select(categoriesSelectors.getSelectedCategoryId).pipe(
    filter(id => !!id),
    withLatestFrom(this.store.select(categoriesSelectors.getSelectedCategory)),
    filter(([id, c]) => !c || (c.hasOnlineSubCategories && !c.subCategories)),
    map(([id, c]) => new categoriesActions.LoadCategory(id))
  );

  @Effect()
  loadCategory$ = this.actions$.pipe(
    ofType(CategoriesActionTypes.LoadCategory),
    map((action: categoriesActions.LoadCategory) => action.payload),
    mergeMap(categoryUniqueId => {
      return this.categoryService.getCategory(categoryUniqueId).pipe(
        map(category => new categoriesActions.LoadCategorySuccess(category)),
        catchError(error => of(new categoriesActions.LoadCategoryFail(error)))
      );
    })
  );

  @Effect()
  loadProductsForCategory$ = combineLatest(
    this.store.pipe(select(categoriesSelectors.getSelectedCategory)),
    this.store.pipe(select(productsSelectors.getSelectedProductId))
  ).pipe(
    filter(([c, selectedProductSku]) => !selectedProductSku),
    filter(([c, sku]) => !sku && c && c.hasOnlineProducts && !c.productSkus),
    concatMap(([c, sku]) => this.productsService.getProductSkuListForCategory(c.uniqueId)),
    switchMap(res => [
      new categoriesActions.SetProductSkusForCategory(res.categoryUniqueId, res.skus),
      ...res.skus.map(sku => new productsActions.LoadProduct(sku)),
    ])
  );


  // TODO: @Ferdinand: non full categories might not be to helpfull
  @Effect()
  saveSubCategories$ = this.actions$.pipe(
    ofType(CategoriesActionTypes.LoadCategorySuccess),
    map((action: categoriesActions.LoadCategorySuccess) => action.payload.subCategories),
    filter(sc => !!sc),
    map(sc => new categoriesActions.SaveSubCategories(sc))
  );
}
