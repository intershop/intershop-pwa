import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Scheduler } from 'rxjs/Scheduler';
import { ProductsService } from '../../services/products/products.service';
import { SuggestService } from '../../services/suggest/suggest.service';
import { LoadProduct } from '../products';
import { ShoppingState } from '../shopping.state';
import { SetSortKeys } from '../viewconf';
import {
  SearchActionTypes,
  SearchProducts,
  SearchProductsFail,
  SearchProductsSuccess,
  SuggestSearch,
  SuggestSearchSuccess,
} from './search.actions';
import { getRequestedSearchTerm } from './search.selectors';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
    private productsService: ProductsService,
    private suggestService: SuggestService,
    private scheduler: Scheduler,
    private router: Router
  ) {}

  /**
   * Effect that listens for search route changes and triggers a search action.
   */
  // TODO: Use ofRoute() operator here or at least do not work with the router state but with the router actions
  @Effect()
  triggerSearch$ = this.store.pipe(
    select(getRequestedSearchTerm),
    filter(searchTerm => !!searchTerm),
    map(searchTerm => new SearchProducts(searchTerm))
  );

  /**
   * Effect that triggers a products search request via REST service and additional actions to fetch the product data of the search results.
   */
  // TODO: API returns only maximum of 50 products -- handle more products (e.g. via paging or lazy loading)
  @Effect()
  searchProducts$ = this.actions$.pipe(
    ofType(SearchActionTypes.SearchProducts),
    map((action: SearchProducts) => action.payload),
    switchMap(searchTerm => {
      // get products
      return this.productsService.searchProducts(searchTerm).pipe(
        mergeMap(res => [
          // dispatch action with search result
          new SearchProductsSuccess({ searchTerm: searchTerm, products: res.skus }),
          // dispatch actions to load the product information of the found products
          ...res.skus.map(sku => new LoadProduct(sku)),
          // dispatch action to store the returned sorting options
          new SetSortKeys(res.sortKeys),
        ]),
        catchError(error => of(new SearchProductsFail(error)))
      );
    })
  );

  @Effect()
  suggestSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.SuggestSearch),
    debounceTime(400, this.scheduler),
    distinctUntilChanged(),
    map((action: SuggestSearch) => action.payload),
    filter(searchTerm => !!searchTerm && searchTerm.length > 0),
    switchMap(searchTerm =>
      this.suggestService
        .search(searchTerm)
        .pipe(map(results => new SuggestSearchSuccess(results)), catchError(() => empty()))
    ) // switchMap is intentional here as it cancels old requests when new occur – which is the right thing for a search
  );

  @Effect({ dispatch: false })
  redirectIfSearchProductFail$ = this.actions$.pipe(
    ofType(SearchActionTypes.SearchProductsFail),
    tap(() => this.router.navigate(['/error']))
  );
}
