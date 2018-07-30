import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ofRoute, RouteNavigation } from 'ngrx-router';
import { EMPTY } from 'rxjs';
import {
  catchError,
  concatMap,
  debounce,
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { mapErrorToAction, partitionBy } from '../../../utils/operators';
import { ProductsService } from '../../services/products/products.service';
import { SuggestService } from '../../services/suggest/suggest.service';
import { LoadProductSuccess } from '../products';
import { ShoppingState } from '../shopping.state';
import {
  canRequestMore,
  getItemsPerPage,
  getPagingPage,
  ResetPagingInfo,
  SetPagingInfo,
  SetPagingLoading,
  SetSortKeys,
} from '../viewconf';
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
    private router: Router
  ) {}

  /**
   * Effect that listens for search route changes and triggers a search action.
   */
  @Effect()
  triggerSearch$ = this.actions$.pipe(
    ofRoute('search/:searchTerm'),
    // wait until config parameter is set
    debounce(() => this.store.pipe(select(getItemsPerPage), filter(x => x > 0))),
    map((action: RouteNavigation) => action.payload.params.searchTerm),
    filter(x => !!x),
    distinctUntilChanged(),
    concatMap(searchTerm => [new ResetPagingInfo(), new SearchProducts(searchTerm)])
  );

  /**
   * partition that listens for product search requests
   */
  private canSearchMoreProducts$ = this.actions$.pipe(
    ofType<{ type: string; payload: string }>(SearchActionTypes.SearchProducts, SearchActionTypes.SearchMoreProducts),
    withLatestFrom(
      this.store.pipe(select(getPagingPage)),
      this.store.pipe(select(getItemsPerPage)),
      this.store.pipe(select(canRequestMore))
    ),
    partitionBy(([, , , canSearchMore]) => canSearchMore)
  );

  /**
   * set paging loading
   */
  @Effect()
  setPagingLoading$ = this.canSearchMoreProducts$.pipe(
    switchMap(canSearchMore => canSearchMore.isTrue),
    mapTo(new SetPagingLoading())
  );

  /**
   * execute a product search respecting pagination
   */
  @Effect()
  searchProducts$ = this.canSearchMoreProducts$.pipe(
    switchMap(canSearchMore => canSearchMore.isTrue),
    map(([action, currentPage, itemsPerPage]) => ({
      searchTerm: action.payload,
      nextPage: currentPage + 1,
      itemsPerPage,
    })),
    distinctUntilChanged(),
    concatMap(({ searchTerm, nextPage, itemsPerPage }) =>
      // get products
      this.productsService.searchProducts(searchTerm, nextPage, itemsPerPage).pipe(
        mergeMap(res => [
          // dispatch action with search result
          new SearchProductsSuccess({ searchTerm: searchTerm, products: res.products.map(p => p.sku) }),
          // dispatch viewconf action
          new SetPagingInfo({ currentPage: nextPage, totalItems: res.total }),
          // dispatch actions to load the product information of the found products
          ...res.products.map(product => new LoadProductSuccess(product)),
          // dispatch action to store the returned sorting options
          new SetSortKeys(res.sortKeys),
        ]),
        mapErrorToAction(SearchProductsFail)
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
        // tslint:disable-next-line:ban
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
