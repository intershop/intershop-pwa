import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Action, Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';
import { concatMap, map, sample, switchMap, withLatestFrom } from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { generateProductUrl } from 'ish-core/routing/product/product.route';
import { SuggestionsServiceProvider } from 'ish-core/service-provider/suggestions.service-provider';
import { ProductsService } from 'ish-core/services/products/products.service';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { loadCategorySuccess } from 'ish-core/store/shopping/categories';
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

import {
  addSearchTermToSuggestion,
  searchProducts,
  searchProductsFail,
  suggestSearch,
  suggestSearchFail,
  suggestSearchSuccess,
} from './search.actions';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private productsService: ProductsService,
    private suggestionsServiceProvider: SuggestionsServiceProvider,
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
      concatMap(searchTerm => [
        addSearchTermToSuggestion({ searchTerm }),
        loadMoreProducts({ id: { type: 'search', value: searchTerm } }),
      ])
    )
  );

  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchProducts),
      mapToPayload(),
      map(payload => ({ ...payload, page: payload.page ? payload.page : 1 })),
      concatLatestFrom(() => this.store.pipe(select(getProductListingItemsPerPage('search')))),
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

  suggestSearch$ =
    !SSR &&
    createEffect(() =>
      this.actions$.pipe(
        ofType(suggestSearch),
        mapToPayloadProperty('searchTerm'),
        switchMap(searchTerm =>
          this.suggestionsServiceProvider
            .get()
            .searchSuggestions(searchTerm)
            .pipe(
              concatMap(({ suggestions, categories, products }) => {
                const actions: Action[] = [suggestSearchSuccess({ suggestions })];
                if (categories) {
                  actions.push(loadCategorySuccess({ categories }));
                }
                if (products) {
                  products.map(product => actions.push(loadProductSuccess({ product })));
                }
                return actions;
              }),
              mapErrorToAction(suggestSearchFail)
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
