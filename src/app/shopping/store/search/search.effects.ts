import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ofRoute, RouteNavigation } from 'ngrx-router';
import { EMPTY, of } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ENDLESS_SCROLLING_ITEMS_PER_PAGE } from '../../../core/configurations/injection-keys';
import { ProductsService } from '../../services/products/products.service';
import { SuggestService } from '../../services/suggest/suggest.service';
import { LoadProduct } from '../products';
import { ShoppingState } from '../shopping.state';
import { canRequestMore, getPagingPage, ResetPagingInfo, SetPagingInfo, SetSortKeys } from '../viewconf';
import {
  SearchActionTypes,
  SearchProducts,
  SearchProductsFail,
  SearchProductsSuccess,
  SuggestSearch,
  SuggestSearchSuccess,
} from './search.actions';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
    private productsService: ProductsService,
    private suggestService: SuggestService,
    private router: Router,
    @Inject(ENDLESS_SCROLLING_ITEMS_PER_PAGE) private itemsPerPage: number
  ) {}

  /**
   * Effect that listens for search route changes and triggers a search action.
   */
  @Effect()
  triggerSearch$ = this.actions$.pipe(
    ofRoute('search/:searchTerm'),
    map((action: RouteNavigation) => action.payload.params['searchTerm']),
    filter(x => !!x),
    distinctUntilChanged(),
    concatMap(searchTerm => [new ResetPagingInfo(), new SearchProducts(searchTerm)])
  );

  /**
   * Effect that triggers a products search request via REST service and additional actions to fetch the product data of the search results.
   */
  @Effect()
  searchProducts$ = this.actions$.pipe(
    ofType<{ type: string; payload: string }>(SearchActionTypes.SearchProducts, SearchActionTypes.SearchMoreProducts),
    withLatestFrom(this.store.pipe(select(getPagingPage)), this.store.pipe(select(canRequestMore(this.itemsPerPage)))),
    filter(([, , canSearchMore]) => canSearchMore),
    map(([action, currentPage]) => ({ searchTerm: action.payload, nextPage: currentPage + 1 })),
    distinctUntilChanged(),
    concatMap(({ searchTerm, nextPage }) =>
      // get products
      this.productsService.searchProducts(searchTerm, nextPage, this.itemsPerPage).pipe(
        mergeMap(res => [
          // dispatch action with search result
          new SearchProductsSuccess({
            searchTerm: searchTerm,
            products: res.skus,
          }),
          // dispatch viewconf action
          new SetPagingInfo({
            currentPage: nextPage,
            totalItems: res.total,
          }),
          // dispatch actions to load the product information of the found products
          ...res.skus.map(sku => new LoadProduct(sku)),
          // dispatch action to store the returned sorting options
          new SetSortKeys(res.sortKeys),
        ]),
        catchError(error => of(new SearchProductsFail(error)))
      )
    )
  );

  @Effect()
  suggestSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.SuggestSearch),
    debounceTime(400),
    distinctUntilKeyChanged('payload'),
    map((action: SuggestSearch) => action.payload),
    filter(searchTerm => !!searchTerm && searchTerm.length > 0),
    switchMap(searchTerm =>
      this.suggestService.search(searchTerm).pipe(
        map(results => new SuggestSearchSuccess(results)),
        catchError(() => EMPTY)
      )
    ) // switchMap is intentional here as it cancels old requests when new occur – which is the right thing for a search
  );

  @Effect({ dispatch: false })
  redirectIfSearchProductFail$ = this.actions$.pipe(
    ofType(SearchActionTypes.SearchProductsFail),
    tap(() => this.router.navigate(['/error']))
  );
}
