import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { ProductsService } from '../../services/products/products.service';
import * as categoriesActions from '../categories/categories.actions';
import { ShoppingState } from '../shopping.state';
import * as fromViewconf from '../viewconf';
import * as productsActions from './products.actions';
import * as productsSelectors from './products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
    private productsService: ProductsService
  ) { }

  @Effect()
  loadProduct$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProduct),
    map((action: productsActions.LoadProduct) => action.payload),
    mergeMap(sku => {
      return this.productsService.getProduct(sku).pipe(
        map(product => new productsActions.LoadProductSuccess(product)),
        catchError(error => of(new productsActions.LoadProductFail(error)))
      );
    })
  );


  @Effect()
  loadProductsForCategory$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProductsForCategory),
    map((action: productsActions.LoadProductsForCategory) => action.payload),
    withLatestFrom(this.store.pipe(select(fromViewconf.getSortBy))),
    concatMap(([categoryUniqueId, sortBy]) => this.productsService.getProductSkuListForCategory(categoryUniqueId, sortBy)),
    switchMap(res => [
      new categoriesActions.SetProductSkusForCategory(res.categoryUniqueId, res.skus),
      new fromViewconf.SetSortKeys(res.sortKeys),
      ...res.skus.map(sku => new productsActions.LoadProduct(sku)),
    ])
  );

  @Effect()
  selectedProduct$ = this.store.pipe(
    select(productsSelectors.getSelectedProductId),
    filter(id => !!id),
    map(id => new productsActions.LoadProduct(id)),
  );
}
