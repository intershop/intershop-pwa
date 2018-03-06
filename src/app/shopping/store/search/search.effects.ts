import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { catchError, distinctUntilChanged, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { getRouterState } from '../../../core/store/router';
import { RouterStateUrl } from '../../../core/store/router/router.reducer';
import { SearchService } from '../../services/products/search.service';
import { LoadProduct } from '../products';
import { ShoppingState } from '../shopping.state';
import { DoSearch, SearchActionTypes, SearchProductFail, SearchProductsAvailable } from './search.actions';

@Injectable()
export class SearchEffects {

  private urlParamSearchTerm = 'SearchTerm';

  constructor(
    private actions$: Actions,
    private store: Store<ShoppingState>,
    private searchService: SearchService,
  ) { }

  /**
   * effect checks for changed search URL and triggers DoSearch action
   */
  @Effect()
  triggerSearch$ = this.store.pipe(
    select(getRouterState),
    filter(router => !!router),
    map((router) => router.state),
    filter((state: RouterStateUrl) => state.url.startsWith('/search') && !!state.queryParams[this.urlParamSearchTerm]),
    distinctUntilChanged(),
    map((state) => state.queryParams[this.urlParamSearchTerm]),
    map((searchTerm) => new DoSearch(searchTerm))
  );

  /**
   * effect checks for DoSearch action, performs search call and triggers LoadProduct and SearchProductsAvailable
   */
  // TODO: API returns only maximum of 50 products -- handle more products (e.g. via paging or lazy loading)
  @Effect()
  performSearch$ = this.actions$.pipe(
    // get action DoSearch
    ofType(SearchActionTypes.DoSearch),
    map((action: DoSearch) => action.payload),
    switchMap(searchTerm => {
      // get products
      return this.searchService.searchForProductSkus(searchTerm).pipe(
        mergeMap((skuArray: string[]) => of<Action>(
          // fire action LoadProducts
          ...skuArray.map(sku => new LoadProduct(sku)),
          // fire action SearchProductsAvailable
          new SearchProductsAvailable(skuArray)
        )),
        catchError(error => of(new SearchProductFail(error)))
      );
    })
  );

}
