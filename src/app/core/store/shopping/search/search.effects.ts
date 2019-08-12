import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { mapToParam, ofRoute } from 'ngrx-router';
import { EMPTY } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';
import { ProductsService } from '../../../services/products/products.service';
import { SuggestService } from '../../../services/suggest/suggest.service';
import { LoadMoreProducts, SetProductListingPages, getProductListingItemsPerPage } from '../product-listing';
import { LoadProductSuccess } from '../products';

import {
  SearchActionTypes,
  SearchProducts,
  SearchProductsFail,
  SelectSearchTerm,
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
    private productListingMapper: ProductListingMapper
  ) {}

  /**
   * Effect that listens for search route changes and triggers a search action.
   */
  @Effect()
  listenToRouteForSearchTerm$ = this.actions$.pipe(
    ofRoute('search/:searchTerm'),
    mapToParam<string>('searchTerm'),
    whenTruthy(),
    distinctUntilChanged(),
    map(searchTerm => new SelectSearchTerm({ searchTerm }))
  );

  /**
   * Effect that listens for search route changes and triggers a search action.
   */
  @Effect()
  triggerSearch$ = this.actions$.pipe(
    ofType<SelectSearchTerm>(SearchActionTypes.SelectSearchTerm),
    mapToPayloadProperty('searchTerm'),
    whenTruthy(),
    distinctUntilChanged(),
    map(searchTerm => new LoadMoreProducts({ id: { type: 'search', value: searchTerm } }))
  );

  @Effect()
  searchProducts$ = this.actions$.pipe(
    ofType<SearchProducts>(SearchActionTypes.SearchProducts),
    mapToPayload(),
    map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
    withLatestFrom(
      this.store.pipe(
        select(getProductListingItemsPerPage),
        whenTruthy()
      )
    ),
    concatMap(([{ searchTerm, page, sorting }, itemsPerPage]) =>
      this.productsService.searchProducts(searchTerm, page, itemsPerPage, sorting).pipe(
        concatMap(({ total, products, sortKeys }) => [
          ...products.map(product => new LoadProductSuccess({ product })),
          new SetProductListingPages(
            this.productListingMapper.createPages(products.map(p => p.sku), 'search', searchTerm, {
              startPage: page,
              sorting,
              sortKeys,
              itemCount: total,
            })
          ),
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
