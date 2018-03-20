import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { Scheduler } from 'rxjs/Scheduler';
import { SuggestService } from '../../../core/services/suggest/suggest.service';
import { getRouterState } from '../../../core/store/router';
import { RouterStateUrl } from '../../../core/store/router/router.reducer';
import { SearchService } from '../../services/products/search.service';
import { LoadProduct } from '../products';
import { ShoppingState } from '../shopping.state';
import { SetSortKeys } from '../viewconf';
import { DoSearch, DoSuggestSearch, SearchActionTypes, SearchProductFail, SearchProductsAvailable, SuggestSearchSuccess } from './search.actions';

@Injectable()
export class SearchEffects {

  private urlParamSearchTerm = 'SearchTerm';

  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
    private searchService: SearchService,
    private suggestService: SuggestService,
    private scheduler: Scheduler,
  ) { }

  /**
   * effect checks for changed search URL and triggers DoSearch action
   */
  // TODO: Use ofRoute() operator here or at least do not work with the router state but with the router actions
  @Effect()
  triggerSearch$ = this.store.pipe(
    select(getRouterState),
    filter(router => !!router),
    map((router) => router.state),
    filter((state: RouterStateUrl) => state.url.startsWith('/search') && !!state.queryParams[this.urlParamSearchTerm]),
    distinctUntilChanged(),
    map(state => state.queryParams[this.urlParamSearchTerm]),
    map(searchTerm => new DoSearch(searchTerm))
  );

  /**
   * effect checks for DoSearch action, performs search call and triggers LoadProduct and SearchProductsAvailable
   */
  // TODO: API returns only maximum of 50 products -- handle more products (e.g. via paging or lazy loading)
  @Effect()
  performSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.DoSearch),
    map((action: DoSearch) => action.payload),
    switchMap(searchTerm => {
      // get products
      return this.searchService.searchForProductSkus(searchTerm).pipe(
        mergeMap(res => [
          // fire actions for loading products
          ...res.skus.map(sku => new LoadProduct(sku)),
          // fire action for search page
          new SearchProductsAvailable(res.skus),
          // fire action for sorting toolbox
          new SetSortKeys(res.sortKeys)
        ]),
        catchError(error => of(new SearchProductFail(error)))
      );
    })
  );

  @Effect()
  suggestSearch$ = this.actions$.pipe(
    ofType(SearchActionTypes.DoSuggestSearch),
    debounceTime(400, this.scheduler),
    distinctUntilChanged(),
    map((action: DoSuggestSearch) => action.payload),
    filter(searchTerm => !!searchTerm && searchTerm.length > 0),
    switchMap(searchTerm => this.suggestService.search(searchTerm).pipe(
      map(results => new SuggestSearchSuccess(results)),
      catchError(() => empty())
    )) // switchMap is intentional here as it cancels old requests when new occur – which is the right thing for a search
  );

}
