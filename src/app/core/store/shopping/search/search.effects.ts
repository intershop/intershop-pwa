import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, from } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  map,
  sample,
  switchMap,
  switchMapTo,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { loadMoreProducts, setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { searchProducts, searchProductsFail, suggestSearch, suggestSearchSuccess } from './search.actions';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private productsService: ProductsService,
    private suggestService: SuggestService,
    private httpStatusCodeService: HttpStatusCodeService,
    private productListingMapper: ProductListingMapper,
    private translateService: TranslateService
  ) {}

  /**
   * Effect that listens for search route changes and triggers a search action.
   */
  triggerSearch$ = createEffect(() =>
    this.store.pipe(
      sample(this.actions$.pipe(ofType(routerNavigatedAction))),
      ofUrl(/^\/search.*/),
      withLatestFrom(this.store.pipe(select(selectRouteParam('searchTerm')))),
      map(([, searchTerm]) => searchTerm),
      whenTruthy(),
      map(searchTerm => loadMoreProducts({ id: { type: 'search', value: searchTerm } }))
    )
  );

  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchProducts),
      mapToPayload(),
      map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
      concatMap(({ searchTerm, page, sorting }) =>
        this.productsService.searchProducts(searchTerm, page, sorting).pipe(
          concatMap(({ total, products, sortableAttributes }) => [
            ...products.map(product => loadProductSuccess({ product })),
            setProductListingPages(
              this.productListingMapper.createPages(
                products.map(p => p.sku),
                'search',
                searchTerm,
                {
                  startPage: page,
                  sorting,
                  sortableAttributes,
                  itemCount: total,
                }
              )
            ),
          ]),
          mapErrorToAction(searchProductsFail)
        )
      )
    )
  );

  suggestSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(suggestSearch),
      mapToPayloadProperty('searchTerm'),
      debounceTime(400),
      distinctUntilChanged(),
      whenTruthy(),
      switchMap(searchTerm =>
        this.suggestService.search(searchTerm).pipe(
          map(suggests => suggestSearchSuccess({ searchTerm, suggests })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  redirectIfSearchProductFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(searchProductsFail),
        concatMap(() => from(this.httpStatusCodeService.setStatus(404)))
      ),
    { dispatch: false }
  );

  setSearchBreadcrumb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMapTo(
        this.store.pipe(
          ofUrl(/^\/search.*/),
          select(selectRouteParam('searchTerm')),
          whenTruthy(),
          switchMap(searchTerm =>
            this.translateService
              .get('search.breadcrumbs.your_search.label')
              .pipe(
                map(translation => setBreadcrumbData({ breadcrumbData: [{ text: `${translation} ${searchTerm}` }] }))
              )
          )
        )
      )
    )
  );
}
