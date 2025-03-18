import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';
import { concatMap, map, sample, switchMap, withLatestFrom } from 'rxjs/operators';

import { ProductListingMapper } from 'ish-core/models/product-listing/product-listing.mapper';
import { SearchParameter } from 'ish-core/models/search/search.model';
import { generateProductUrl } from 'ish-core/routing/product/product.route';
import { SearchServiceProvider } from 'ish-core/services/search/provider/search.service.provider';
import { SuggestionServiceProvider } from 'ish-core/services/suggestion/provider/suggestion.service.provider';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { loadFilterSuccess } from 'ish-core/store/shopping/filter';
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
    private searchServiceProvider: SearchServiceProvider,
    private suggestionServiceProvider: SuggestionServiceProvider,
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
      map(
        ([payload, pageSize]) =>
          <SearchParameter>{
            searchTerm: payload.searchTerm,
            offset: (payload.page - 1) * pageSize,
            amount: pageSize,
            page: payload.page,
            sorting: payload.sorting,
          }
      ),
      concatMap(searchParameter =>
        this.searchServiceProvider
          .get()
          .searchProducts(searchParameter)
          .pipe(
            concatMap(searchResponse => {
              // route to product detail page if only one product was found
              if (searchResponse.total === 1) {
                this.router.navigate([generateProductUrl(searchResponse.products[0])]);
              }
              // provide the data for the search result page
              return [
                ...searchResponse.products.map(product => loadProductSuccess({ product })),
                setProductListingPages(
                  this.productListingMapper.createPages(
                    searchResponse.products.map(p => p.sku),
                    'search',
                    searchParameter.searchTerm,
                    searchParameter.amount,
                    {
                      startPage: searchParameter.page,
                      sorting: searchParameter.sorting,
                      sortableAttributes: searchResponse.sortableAttributes,
                      itemCount: searchResponse.total,
                    }
                  )
                ),
                searchResponse.filter
                  ? loadFilterSuccess({ filterNavigation: { filter: searchResponse.filter } })
                  : { type: 'NO_ACTION' },
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
        concatMap(searchTerm =>
          this.suggestionServiceProvider
            .get()
            .search(searchTerm)
            .pipe(
              map(suggests => suggestSearchSuccess({ suggests })),
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
