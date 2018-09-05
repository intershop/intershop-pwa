import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { RouteNavigation, ofRoute } from 'ngrx-router';
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
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { mapErrorToAction } from '../../../utils/operators';
import { ProductsService } from '../../services/products/products.service';
import { SuggestService } from '../../services/suggest/suggest.service';
import { LoadProductSuccess } from '../products';
import {
  SetPage,
  SetPagingInfo,
  SetPagingLoading,
  SetSortKeys,
  canRequestMore,
  getItemsPerPage,
  getPagingPage,
  isEndlessScrollingEnabled,
} from '../viewconf';

import {
  PrepareNewSearch,
  SearchActionTypes,
  SearchMoreProducts,
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
    private store: Store<{}>,
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
    debounce(() =>
      this.store.pipe(
        select(getItemsPerPage),
        filter(x => x > 0)
      )
    ),
    map((action: RouteNavigation) => action.payload.params.searchTerm),
    filter(x => !!x),
    distinctUntilChanged(),
    mergeMap(searchTerm => [new PrepareNewSearch(), new SearchProducts(searchTerm)])
  );

  @Effect()
  searchMoreProducts$ = this.actions$.pipe(
    ofType<SearchMoreProducts>(SearchActionTypes.SearchMoreProducts),
    withLatestFrom(
      this.store.pipe(select(isEndlessScrollingEnabled)),
      this.store.pipe(select(canRequestMore)),
      this.store.pipe(
        select(getPagingPage),
        map(n => n + 1)
      )
    ),
    filter(([, endlessScrolling, moreProductsAvailable]) => endlessScrolling && moreProductsAvailable),
    mergeMap(([action, , , page]) => [new SetPagingLoading(), new SetPage(page), new SearchProducts(action.payload)])
  );

  /**
   * execute a product search respecting pagination
   */
  @Effect()
  searchProducts$ = this.actions$.pipe(
    ofType<SearchProducts>(SearchActionTypes.SearchProducts),
    map(action => action.payload),
    withLatestFrom(this.store.pipe(select(getPagingPage)), this.store.pipe(select(getItemsPerPage))),
    distinctUntilChanged(),
    concatMap(([searchTerm, page, itemsPerPage]) =>
      // get products
      this.productsService.searchProducts(searchTerm, page, itemsPerPage).pipe(
        mergeMap(res => [
          // dispatch action with search result
          new SearchProductsSuccess(searchTerm),
          // dispatch viewconf action
          new SetPagingInfo({ currentPage: page, totalItems: res.total, newProducts: res.products.map(p => p.sku) }),
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
    ofType<SuggestSearch>(SearchActionTypes.SuggestSearch),
    debounceTime(400),
    distinctUntilKeyChanged('payload'),
    map(action => action.payload),
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
