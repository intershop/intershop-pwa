import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { EMPTY } from 'rxjs';
import { catchError, concatMap, debounceTime, distinctUntilChanged, map, sample, switchMap, tap } from 'rxjs/operators';

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
  triggerSearch$ = this.store.pipe(
    ofUrl(/^\/search.*/),
    select(selectRouteParam('searchTerm')),
    sample(this.actions$.pipe(ofType(routerNavigatedAction))),
    whenTruthy(),
    map(searchTerm => new LoadMoreProducts({ id: { type: 'search', value: searchTerm } })),
    distinctUntilChanged(isEqual)
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
            this.productListingMapper.createPages(
              products.map(p => p.sku),
              'search',
              searchTerm,
              {
                startPage: page,
                sorting,
                sortKeys,
                itemCount: total,
              }
            )
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
    whenTruthy(),
    switchMap(searchTerm =>
      this.suggestService.search(searchTerm).pipe(
        map(suggests => new SuggestSearchSuccess({ searchTerm, suggests })),
        // tslint:disable-next-line:ban
        catchError(() => EMPTY)
      )
    )
  );

  @Effect({ dispatch: false })
  redirectIfSearchProductFail$ = this.actions$.pipe(
    ofType(SearchActionTypes.SearchProductsFail),
    tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
  );
}
