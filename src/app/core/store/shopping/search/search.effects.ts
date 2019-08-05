import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  mapTo,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';
import { ProductsService } from '../../../services/products/products.service';
import { SuggestService } from '../../../services/suggest/suggest.service';
import {
  LoadMoreProducts,
  SetProductListingPages,
  getProductListingItemsPerPage,
  getProductListingView,
} from '../product-listing';
import { LoadProductSuccess } from '../products';

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
    private store: Store<{}>,
    private productsService: ProductsService,
    private suggestService: SuggestService,
    private httpStatusCodeService: HttpStatusCodeService,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Effect that listens for search route changes and triggers a search action.
   */
  @Effect()
  triggerSearch$ = this.actions$.pipe(
    ofRoute('search/:searchTerm'),
    mapToParam<string>('searchTerm'),
    whenTruthy(),
    distinctUntilChanged(),
    switchMap(searchTerm =>
      this.activatedRoute.queryParamMap.pipe(
        map(params => +params.get('page') || undefined),
        distinctUntilChanged(),
        switchMap(page =>
          this.store.pipe(
            select(getProductListingView, { type: 'search', value: searchTerm }),
            filter(view => !view.productsOfPage(page).length),
            mapTo(new LoadMoreProducts({ id: { type: 'search', value: searchTerm }, page }))
          )
        )
      )
    )
  );

  @Effect()
  searchProducts$ = this.actions$.pipe(
    ofType<SearchProducts>(SearchActionTypes.SearchProducts),
    debounce(() =>
      this.store.pipe(
        select(getProductListingItemsPerPage),
        whenTruthy()
      )
    ),
    mapToPayload(),
    map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
    withLatestFrom(this.store.pipe(select(getProductListingItemsPerPage))),
    concatMap(([{ searchTerm, page, sorting }, itemsPerPage]) =>
      this.productsService.searchProducts(searchTerm, page, itemsPerPage, sorting).pipe(
        switchMap(({ total, products, sortKeys }) => [
          ...products.map(product => new LoadProductSuccess({ product })),
          new SearchProductsSuccess({ searchTerm }),
          new SetProductListingPages({
            id: { type: 'search', value: searchTerm, sorting },
            itemCount: total,
            [page]: products.map(p => p.sku),
            sortKeys,
          }),
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
