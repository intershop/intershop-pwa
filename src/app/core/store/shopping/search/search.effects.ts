import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
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
import { ProductsService } from 'ish-core/services/products/products.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { ofUrl, selectRouteParam } from 'ish-core/store/router';
import { LoadMoreProducts, SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { LoadProductSuccess } from 'ish-core/store/shopping/products';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  SearchActionTypes,
  SearchProducts,
  SearchProductsFail,
  SelectSearchTerm,
  SuggestSearch,
  SuggestSearchAPI,
  SuggestSearchSuccess,
} from './search.actions';
import { getSuggestSearchEntities } from './search.selectors';

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
  listenToRouteForSearchTerm$ = this.store.pipe(
    ofUrl(/^\/search.*/),
    select(selectRouteParam('searchTerm')),
    whenTruthy(),
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
    map(searchTerm => new LoadMoreProducts({ id: { type: 'search', value: searchTerm } }))
  );

  @Effect()
  searchProducts$ = this.actions$.pipe(
    ofType<SearchProducts>(SearchActionTypes.SearchProducts),
    mapToPayload(),
    map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
    concatMap(({ searchTerm, page, sorting }) =>
      this.productsService.searchProducts(searchTerm, page, sorting).pipe(
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
    distinctUntilChanged(),
    filter(searchTerm => !!searchTerm && searchTerm.length > 0),
    withLatestFrom(this.store.pipe(select(getSuggestSearchEntities))),
    switchMap(([searchTerm, entities]) =>
      entities[searchTerm]
        ? [
            new SuggestSearchSuccess({ searchTerm, suggests: entities[searchTerm].suggestSearchResults }),
            new SuggestSearchAPI({ searchTerm }),
          ]
        : [new SuggestSearchAPI({ searchTerm })]
    )
  );

  @Effect()
  suggestSearchAPI$ = this.actions$.pipe(
    ofType<SuggestSearchAPI>(SearchActionTypes.SuggestSearchAPI),
    mapToPayloadProperty('searchTerm'),
    debounceTime(400),
    distinctUntilChanged(),
    filter(searchTerm => !!searchTerm && searchTerm.length > 0),
    switchMap(searchTerm =>
      this.suggestService.search(searchTerm).pipe(
        map(suggests => new SuggestSearchSuccess({ searchTerm, suggests })),
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
