import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { EMPTY } from 'rxjs';
import { catchError, concatMap, debounceTime, distinctUntilChanged, map, sample, switchMap, tap } from 'rxjs/operators';

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
      ofUrl(/^\/search.*/),
      select(selectRouteParam('searchTerm')),
      sample(this.actions$.pipe(ofType(routerNavigatedAction))),
      whenTruthy(),
      map(searchTerm => loadMoreProducts({ id: { type: 'search', value: searchTerm } })),
      distinctUntilChanged(isEqual)
    )
  );

  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchProducts),
      mapToPayload(),
      map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
      concatMap(({ searchTerm, page, sorting }) =>
        this.productsService.searchProducts(searchTerm, page, sorting).pipe(
          concatMap(({ total, products, sortKeys }) => [
            ...products.map(product => loadProductSuccess({ product })),
            setProductListingPages(
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
          // tslint:disable-next-line:ban
          catchError(() => EMPTY)
        )
      )
    )
  );

  redirectIfSearchProductFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(searchProductsFail),
        tap(() => this.httpStatusCodeService.setStatusAndRedirect(404))
      ),
    { dispatch: false }
  );

  setSearchBreadcrumb$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/search.*/),
      select(selectRouteParam('searchTerm')),
      whenTruthy(),
      switchMap(searchTerm =>
        this.translateService
          .get('search.breadcrumbs.your_search.label')
          .pipe(map(translation => setBreadcrumbData({ breadcrumbData: [{ text: `${translation} ${searchTerm}` }] })))
      )
    )
  );
}
