import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { ProductsService } from '../../services/products/products.service';
import { ShoppingState } from '../shopping.state';
import * as productsActions from './products.actions';
import { ProductsActionTypes } from './products.actions';
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
    ofType(ProductsActionTypes.LoadProduct),
    map((action: productsActions.LoadProduct) => action.payload),
    mergeMap(sku => {
      return this.productsService.getProduct(sku).pipe(
        map(product => new productsActions.LoadProductSuccess(product)),
        catchError(error => of(new productsActions.LoadProductFail(error)))
      );
    })
  );

  @Effect()
  selectedProduct$ = this.store.select(productsSelectors.getSelectedProductId).pipe(
    filter(id => !!id),
    map(id => new productsActions.LoadProduct(id)),
  );
}
