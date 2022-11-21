import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  takeWhile,
  withLatestFrom,
} from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { generateProductUrl } from 'ish-core/routing/product/product.route';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import {
  getProductListingItemsPerPage,
  loadMoreProducts,
  setProductListingPages,
} from 'ish-core/store/shopping/product-listing';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  useCombinedObservableOnAction,
  whenTruthy,
} from 'ish-core/utils/operators';

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
    private translateService: TranslateService,
    private router: Router
  ) {}

  /**
   * Effect that listens for search route changes and triggers a search action.
   */
  triggerSearch$ = createEffect(() =>
    this.store.pipe(
      sample(
        this.actions$.pipe(
          useCombinedObservableOnAction(
            this.actions$.pipe(ofType(routerNavigatedAction)),
            personalizationStatusDetermined
          )
        )
      ),
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
      withLatestFrom(this.store.pipe(select(getProductListingItemsPerPage('search')))),
      map(([payload, pageSize]) => ({ ...payload, amount: pageSize, offset: (payload.page - 1) * pageSize })),
      concatMap(({ searchTerm, amount, sorting, offset, page }) =>
        this.productsService.searchProducts(searchTerm, amount, sorting, offset).pipe(
          concatMap(({ total, products, sortableAttributes }) => {
            // route to product detail page if only one product was found
            if (total === 1) {
              this.router.navigate([generateProductUrl(products[0])]);
            }
            // provide the data for the search result page
            return [
              ...products.map(product => loadProductSuccess({ product })),
              setProductListingPages(
                this.productListingMapper.createPages(
                  products.map(p => p.sku),
                  'search',
                  searchTerm,
                  amount,
                  {
                    startPage: page,
                    sorting,
                    sortableAttributes,
                    itemCount: total,
                  }
                )
              ),
            ];
          }),
          mapErrorToAction(searchProductsFail)
        )
      )
    )
  );

  suggestSearch$ = createEffect(() =>
    this.actions$.pipe(
      takeWhile(() => !SSR),
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
      switchMap(() =>
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
