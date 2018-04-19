import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { CoreState } from '../../../core/store/core.state';
import { getCurrentLocale } from '../../../core/store/locale';
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
    private store: Store<ShoppingState | CoreState>,
    private productsService: ProductsService,
    private router: Router
  ) {}

  @Effect()
  loadProduct$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProduct),
    map((action: productsActions.LoadProduct) => action.payload),
    mergeMap(sku => {
      return this.productsService
        .getProduct(sku)
        .pipe(
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
    concatMap(([categoryUniqueId, sortBy]) =>
      this.productsService
        .getCategoryProducts(categoryUniqueId, sortBy)
        .pipe(
          switchMap(res => [
            new categoriesActions.SetProductSkusForCategory(res.categoryUniqueId, res.skus),
            new fromViewconf.SetSortKeys(res.sortKeys),
            ...res.skus.map(sku => new productsActions.LoadProduct(sku)),
          ]),
          catchError(error => of(new productsActions.LoadProductFail(error)))
        )
    )
  );

  @Effect()
  selectedProduct$ = this.store.pipe(
    select(productsSelectors.getSelectedProductId),
    filter(id => !!id),
    map(id => new productsActions.LoadProduct(id))
  );

  @Effect()
  languageChange$ = this.store.pipe(
    select(getCurrentLocale),
    filter(x => !!x),
    distinctUntilChanged(),
    withLatestFrom(this.store.pipe(select(productsSelectors.getSelectedProductId))),
    filter(([locale, sku]) => !!sku),
    map(([locale, sku]) => new productsActions.LoadProduct(sku))
  );

  @Effect({ dispatch: false })
  redirectIfErrorInProducts$ = this.actions$.pipe(
    ofType(productsActions.ProductsActionTypes.LoadProductFail),
    tap(() => this.router.navigate(['/error']))
  );
}
