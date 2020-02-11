import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { LoadMoreProducts, SetProductListingPageSize } from 'ish-core/store/shopping/product-listing';
import { ProductListingEffects } from 'ish-core/store/shopping/product-listing/product-listing.effects';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import {
  SearchProducts,
  SearchProductsFail,
  SelectSearchTerm,
  SuggestSearch,
  SuggestSearchAPI,
} from './search.actions';
import { SearchEffects } from './search.effects';

describe('Search Effects', () => {
  let productsServiceMock: ProductsService;
  let suggestServiceMock: SuggestService;

  beforeEach(() => {
    suggestServiceMock = mock(SuggestService);
    const result = [{ type: undefined, term: 'Goods' }];
    when(suggestServiceMock.search(anyString())).thenReturn(of<SuggestTerm[]>(result));
    productsServiceMock = mock(ProductsService);
    const skus = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    when(productsServiceMock.searchProducts(anyString(), anyNumber(), anything())).thenCall(
      (searchTerm: string, page: number, itemsPerPage: number) => {
        if (!searchTerm) {
          return throwError({ message: 'ERROR' });
        } else {
          const currentSlice = skus.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);
          return of({
            products: currentSlice.map(sku => ({ sku })),
            sortKeys: [],
            total: skus.length,
          });
        }
      }
    );
  });

  describe('with marbles', () => {
    let actions$: Observable<Action>;
    let effects: SearchEffects;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          ngrxTesting({
            reducers: {
              shopping: combineReducers(shoppingReducers),
            },
          }),
        ],
        providers: [
          SearchEffects,
          provideMockActions(() => actions$),
          { provide: ApiService, useFactory: () => instance(mock(ApiService)) },
          { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
          { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
          { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 3 },
        ],
      });

      effects = TestBed.get(SearchEffects);

      const store = TestBed.get(Store);
      store.dispatch(new SetProductListingPageSize({ itemsPerPage: TestBed.get(PRODUCT_LISTING_ITEMS_PER_PAGE) }));
    });

    describe('listenToRouteForSearchTerm$', () => {
      it('should trigger action if search URL is matched', () => {
        const action = new RouteNavigation({
          path: 'search/:searchTerm',
          params: { searchTerm: 'dummy' },
        });
        actions$ = hot('a-a-|', { a: action });

        expect(effects.listenToRouteForSearchTerm$).toBeObservable(
          cold('a-a-|', { a: new SelectSearchTerm({ searchTerm: 'dummy' }) })
        );
      });
    });

    describe('triggerSearch$', () => {
      it('should trigger action if search URL is matched', () => {
        const action = new SelectSearchTerm({ searchTerm: 'dummy' });
        actions$ = hot('a-a-|', { a: action });

        expect(effects.triggerSearch$).toBeObservable(
          cold('a-a-|', { a: new LoadMoreProducts({ id: { type: 'search', value: 'dummy' }, page: undefined }) })
        );
      });
    });

    describe('searchProducts$', () => {
      it('should perform a search with given search term when search is requested', done => {
        const searchTerm = '123';
        const action = new SearchProducts({ searchTerm });
        actions$ = of(action);

        effects.searchProducts$.subscribe(() => {
          verify(productsServiceMock.searchProducts(searchTerm, 1, anything())).once();
          done();
        });
      });
    });

    describe('suggestSearch$', () => {
      it('should perform a suggest-search with given search term when suggest-search is requested', () => {
        const id = 'searchbox';

        const a = new SuggestSearch({ searchTerm: 'A', id });
        const b = new SuggestSearch({ searchTerm: 'B', id });
        actions$ = hot('a-b-a-|', { a, b });

        expect(effects.suggestSearch$).toBeObservable(
          cold('a-b-a-|', {
            a: new SuggestSearchAPI({ searchTerm: 'A' }),
            b: new SuggestSearchAPI({ searchTerm: 'B' }),
          })
        );
      });
    });
  });

  describe('with fakeAsync', () => {
    let store$: TestStore;
    let effects: SearchEffects;
    let location: Location;

    @Component({ template: 'dummy' })
    class DummyComponent {}

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DummyComponent],
        imports: [
          RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }]),
          ngrxTesting({
            reducers: {
              shopping: combineReducers(shoppingReducers),
            },
            effects: [SearchEffects, ProductListingEffects],
          }),
        ],
        providers: [
          { provide: ApiService, useFactory: () => instance(mock(ApiService)) },
          { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
          { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
          { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 3 },
          { provide: DEFAULT_PRODUCT_LISTING_VIEW_TYPE, useValue: 'grid' },
        ],
      });

      effects = TestBed.get(SearchEffects);
      store$ = TestBed.get(TestStore);
      location = TestBed.get(Location);

      store$.dispatch(new SetProductListingPageSize({ itemsPerPage: TestBed.get(PRODUCT_LISTING_ITEMS_PER_PAGE) }));
    });

    describe('suggestSearch$', () => {
      it('should not fire when search term is falsy', fakeAsync(() => {
        const action = new SuggestSearch({ searchTerm: undefined, id: 'searchbox' });
        store$.dispatch(action);

        tick(5000);

        verify(suggestServiceMock.search(anyString())).never();
      }));

      it('should not fire when search term is empty', fakeAsync(() => {
        const action = new SuggestSearch({ searchTerm: '', id: 'searchbox' });
        store$.dispatch(action);

        tick(5000);

        verify(suggestServiceMock.search(anyString())).never();
      }));

      it('should return search terms when available', fakeAsync(() => {
        const action = new SuggestSearch({ searchTerm: 'g', id: 'searchbox' });
        store$.dispatch(action);

        tick(5000);

        verify(suggestServiceMock.search(anyString())).once();
      }));

      it('should debounce correctly when search term is entered stepwise', fakeAsync(() => {
        store$.dispatch(new SuggestSearch({ searchTerm: 'g', id: 'searchbox' }));
        tick(50);
        store$.dispatch(new SuggestSearch({ searchTerm: 'goo', id: 'searchbox' }));
        tick(100);
        store$.dispatch(new SuggestSearch({ searchTerm: 'good', id: 'searchbox' }));
        tick(200);

        verify(suggestServiceMock.search(anyString())).never();

        tick(400);
        verify(suggestServiceMock.search(anyString())).once();
      }));

      it('should send only once if search term is entered multiple times', fakeAsync(() => {
        store$.dispatch(new SuggestSearch({ searchTerm: 'good', id: 'searchbox' }));
        tick(2000);
        verify(suggestServiceMock.search(anyString())).once();
        store$.dispatch(new SuggestSearch({ searchTerm: 'good', id: 'searchbox' }));
        tick(2000);

        verify(suggestServiceMock.search(anyString())).once();
      }));

      it('should not fire action when error is encountered at service level', fakeAsync(() => {
        when(suggestServiceMock.search(anyString())).thenReturn(throwError({ message: 'ERROR' }));

        store$.dispatch(new SuggestSearchAPI({ searchTerm: 'good' }));
        tick(4000);

        effects.suggestSearch$.subscribe(fail, fail, fail);

        verify(suggestServiceMock.search(anyString())).once();
      }));

      it('should fire all necessary actions for suggest-search', fakeAsync(() => {
        store$.dispatch(new SuggestSearch({ searchTerm: 'good', id: 'searchbox' }));
        tick(500); // debounceTime
        expect(store$.actionsArray(/\[Suggest Search/)).toMatchInlineSnapshot(`
          [Suggest Search] Load Search Suggestions:
            searchTerm: "good"
            id: "searchbox"
          [Suggest Search Internal] Trigger API Call for Search Suggestions:
            searchTerm: "good"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "good"
            suggests: [{"term":"Goods"}]
        `);

        // 2nd term to because distinctUntilChanged
        store$.dispatch(new SuggestSearch({ searchTerm: 'goo', id: 'searchbox' }));
        tick(500);
        expect(store$.actionsArray(/\[Suggest Search/)).toMatchInlineSnapshot(`
          [Suggest Search] Load Search Suggestions:
            searchTerm: "good"
            id: "searchbox"
          [Suggest Search Internal] Trigger API Call for Search Suggestions:
            searchTerm: "good"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "good"
            suggests: [{"term":"Goods"}]
          [Suggest Search] Load Search Suggestions:
            searchTerm: "goo"
            id: "searchbox"
          [Suggest Search Internal] Trigger API Call for Search Suggestions:
            searchTerm: "goo"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "goo"
            suggests: [{"term":"Goods"}]
        `);

        // test cache: search->api->success & search->success->api->success
        store$.dispatch(new SuggestSearch({ searchTerm: 'good', id: 'searchbox' }));
        tick(500);
        expect(store$.actionsArray(/\[Suggest Search/)).toMatchInlineSnapshot(`
          [Suggest Search] Load Search Suggestions:
            searchTerm: "good"
            id: "searchbox"
          [Suggest Search Internal] Trigger API Call for Search Suggestions:
            searchTerm: "good"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "good"
            suggests: [{"term":"Goods"}]
          [Suggest Search] Load Search Suggestions:
            searchTerm: "goo"
            id: "searchbox"
          [Suggest Search Internal] Trigger API Call for Search Suggestions:
            searchTerm: "goo"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "goo"
            suggests: [{"term":"Goods"}]
          [Suggest Search] Load Search Suggestions:
            searchTerm: "good"
            id: "searchbox"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "good"
            suggests: [{"term":"Goods"}]
          [Suggest Search Internal] Trigger API Call for Search Suggestions:
            searchTerm: "good"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "good"
            suggests: [{"term":"Goods"}]
        `);
      }));
    });

    describe('redirectIfSearchProductFail$', () => {
      it('should redirect if triggered', fakeAsync(() => {
        const action = new SearchProductsFail({ error: { status: 404 } as HttpError });

        store$.dispatch(action);

        tick(4000);

        expect(location.path()).toEqual('/error');
      }));
    });

    describe('searchProducts$', () => {
      it('should perform an additional search for given search term and trigger actions', fakeAsync(() => {
        const searchTerm = '123';

        store$.dispatch(new SearchProducts({ searchTerm }));
        verify(productsServiceMock.searchProducts(searchTerm, 1, anything())).once();

        store$.dispatch(new LoadMoreProducts({ id: { type: 'search', value: searchTerm }, page: 2 }));
        verify(productsServiceMock.searchProducts(searchTerm, 2, anything())).once();

        store$.dispatch(new LoadMoreProducts({ id: { type: 'search', value: searchTerm }, page: 3 }));
        verify(productsServiceMock.searchProducts(searchTerm, 3, anything())).once();
      }));
    });
  });
});
