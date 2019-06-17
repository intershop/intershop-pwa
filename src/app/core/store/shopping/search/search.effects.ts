import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { mapToParam, ofRoute } from 'ngrx-router';
import { EMPTY } from 'rxjs';
import {
  catchError,
  concatMap,
  debounce,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';
import { ProductsService } from '../../../services/products/products.service';
import { SuggestService } from '../../../services/suggest/suggest.service';
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
    private httpStatusCodeService: HttpStatusCodeService
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
    mapToParam<string>('searchTerm'),
    whenTruthy(),
    distinctUntilChanged(),
    mergeMap(searchTerm => [new PrepareNewSearch(), new SearchProducts({ searchTerm })])
  );

  @Effect()
  searchMoreProducts$ = this.actions$.pipe(
    ofType<SearchMoreProducts>(SearchActionTypes.SearchMoreProducts),
    mapToPayloadProperty('searchTerm'),
    withLatestFrom(
      this.store.pipe(select(isEndlessScrollingEnabled)),
      this.store.pipe(select(canRequestMore)),
      this.store.pipe(
        select(getPagingPage),
        map(n => n + 1)
      )
    ),
    filter(([, endlessScrolling, moreProductsAvailable]) => endlessScrolling && moreProductsAvailable),
    mergeMap(([searchTerm, , , pageNumber]) => [
      new SetPagingLoading(),
      new SetPage({ pageNumber }),
      new SearchProducts({ searchTerm }),
    ])
  );

  /**
   * execute a product search respecting pagination
   */
  @Effect()
  searchProducts$ = this.actions$.pipe(
    ofType<SearchProducts>(SearchActionTypes.SearchProducts),
    mapToPayloadProperty('searchTerm'),
    withLatestFrom(this.store.pipe(select(getPagingPage)), this.store.pipe(select(getItemsPerPage))),
    distinctUntilChanged(),
    concatMap(([searchTerm, currentPage, itemsPerPage]) =>
      this.productsService.searchProducts(searchTerm, currentPage, itemsPerPage).pipe(
        mergeMap(({ total: totalItems, products, sortKeys }) => [
          // dispatch action with search result
          new SearchProductsSuccess({ searchTerm }),
          // dispatch viewconf action
          new SetPagingInfo({ currentPage, totalItems, newProducts: products.map(p => p.sku) }),
          // dispatch actions to load the product information of the found products
          ...products.map(product => new LoadProductSuccess({ product })),
          // dispatch action to store the returned sorting options
          new SetSortKeys({ sortKeys }),
        ]),
        mapErrorToAction(SearchProductsFail)
      )
    )
  );

  @Effect()
  suggestSearch$ = this.actions$.pipe(
    ofType<SuggestSearch>(SearchActionTypes.SuggestSearch),
    mapToPayloadProperty('searchTerm'),
    debounceTime(400),
    distinctUntilChanged(),
    filter(searchTerm => !!searchTerm && searchTerm.length > 0),
    switchMap(searchTerm =>
      this.suggestService.search(searchTerm).pipe(
        map(suggests => new SuggestSearchSuccess({ suggests })),
        // tslint:disable-next-line:ban
        catchError(() => EMPTY)
      )
    ) // switchMap is intentional here as it cancels old requests when new occur – which is the right thing for a search
  );

  @Effect({ dispatch: false })
  redirectIfSearchProductFail$ = this.actions$.pipe(
    ofType(SearchActionTypes.SearchProductsFail),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
  );
}
