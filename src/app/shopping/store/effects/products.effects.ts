import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, delay, filter, map, switchMap } from 'rxjs/operators';
import { ProductsService } from '../../services/products/products.service';
import * as productsActions from '../actions/products.actions';
import * as productsReducers from '../reducers/products.reducer';
import * as productsSelectors from '../selectors/products.selectors';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<productsReducers.ProductsState>,
    private productsService: ProductsService
  ) { }

  @Effect()
  loadProduct$ = this.actions$.pipe(
    ofType(productsActions.LOAD_PRODUCT),
    map((action: productsActions.LoadProduct) => action.payload),
    switchMap(sku => {
      return this.productsService.getProduct(sku).pipe(
        delay(2000), // DEBUG
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
