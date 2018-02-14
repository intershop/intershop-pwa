import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, filter, map, mergeMap, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { log } from '../../../dev-utils/operators';
import { ProductsService } from '../../services/products/products.service';
import * as fromStore from '../../store';
import * as categoriesActions from '../actions/categories.actions';
import { CategoriesActionTypes } from '../actions/categories.actions';
import * as productsActions from '../actions/products.actions';
import * as categoriesSelectors from '../selectors/categories.selectors';
import * as productsSelectors from '../selectors/products.selectors';

@Injectable()
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromStore.ShoppingState>,
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
    ofType(CategoriesActionTypes.LOAD_CATEGORY),
    map((action: categoriesActions.LoadCategory) => action.payload),
    mergeMap(categoryUniqueId => {
      return this.categoryService.getCategory(categoryUniqueId).pipe(
        map(category => new categoriesActions.LoadCategorySuccess(category)),
        catchError(error => of(new categoriesActions.LoadCategoryFail(error)))
      );
    })
  );

  @Effect()
  loadProductsForCategory$ = this.store.select(categoriesSelectors.getSelectedCategory).pipe(
    withLatestFrom(this.store.select(productsSelectors.getSelectedProductId)),
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
    ofType(CategoriesActionTypes.LOAD_CATEGORY_SUCCESS),
    map((action: categoriesActions.LoadCategorySuccess) => action.payload.subCategories),
    filter(sc => !!sc),
    map(sc => new categoriesActions.SaveSubCategories(sc))
  );
}
