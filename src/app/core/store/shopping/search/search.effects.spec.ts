import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
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
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { LoadMoreProducts, SetProductListingPageSize } from 'ish-core/store/shopping/product-listing';
import { ProductListingEffects } from 'ish-core/store/shopping/product-listing/product-listing.effects';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { SearchProductsFail, SuggestSearch } from './search.actions';
import { SearchEffects } from './search.effects';

describe('Search Effects', () => {
  let store$: StoreWithSnapshots;
  let effects: SearchEffects;
  let location: Location;
  let router: Router;
  let productsServiceMock: ProductsService;
  let suggestServiceMock: SuggestService;
  const suggests = [{ term: 'Goods' }] as SuggestTerm[];

  beforeEach(() => {
    suggestServiceMock = mock(SuggestService);
    when(suggestServiceMock.search(anyString())).thenReturn(of<SuggestTerm[]>(suggests));
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

    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router'], [SearchEffects, ProductListingEffects]),
        RouterTestingModule.withRoutes([
          { path: 'error', component: DummyComponent },
          { path: 'search/:searchTerm', component: DummyComponent },
        ]),
        ShoppingStoreModule.forTesting('productListing'),
      ],
      providers: [
        provideStoreSnapshots(),
        { provide: ApiService, useFactory: () => instance(mock(ApiService)) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
        { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 3 },
        { provide: DEFAULT_PRODUCT_LISTING_VIEW_TYPE, useValue: 'grid' },
      ],
    });

    effects = TestBed.inject(SearchEffects);
    store$ = TestBed.inject(StoreWithSnapshots);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);

    store$.dispatch(new SetProductListingPageSize({ itemsPerPage: TestBed.inject(PRODUCT_LISTING_ITEMS_PER_PAGE) }));
  });

  describe('triggerSearch$', () => {
    it('should trigger action if search URL is matched', done => {
      router.navigateByUrl('/search/dummy');

      effects.triggerSearch$.subscribe(data => {
        expect(data).toMatchInlineSnapshot(`
            [ProductListing] Load More Products:
              id: {"type":"search","value":"dummy"}
          `);
        done();
      });
    });
  });

  describe('suggestSearch$', () => {
    it('should not fire when search term is falsy', fakeAsync(() => {
      const action = new SuggestSearch({ searchTerm: undefined });
      store$.dispatch(action);

      tick(5000);

      verify(suggestServiceMock.search(anyString())).never();
    }));

    it('should not fire when search term is empty', fakeAsync(() => {
      const action = new SuggestSearch({ searchTerm: '' });
      store$.dispatch(action);

      tick(5000);

      verify(suggestServiceMock.search(anyString())).never();
    }));

    it('should return search terms when available', fakeAsync(() => {
      const action = new SuggestSearch({ searchTerm: 'g' });
      store$.dispatch(action);

      tick(5000);

      verify(suggestServiceMock.search('g')).once();
    }));

    it('should debounce correctly when search term is entered stepwise', fakeAsync(() => {
      store$.dispatch(new SuggestSearch({ searchTerm: 'g' }));
      tick(50);
      store$.dispatch(new SuggestSearch({ searchTerm: 'goo' }));
      tick(100);
      store$.dispatch(new SuggestSearch({ searchTerm: 'good' }));
      tick(200);

      verify(suggestServiceMock.search(anyString())).never();

      tick(400);
      verify(suggestServiceMock.search('good')).once();
    }));

    it('should send only once if search term is entered multiple times', fakeAsync(() => {
      store$.dispatch(new SuggestSearch({ searchTerm: 'good' }));
      tick(2000);
      verify(suggestServiceMock.search('good')).once();
      store$.dispatch(new SuggestSearch({ searchTerm: 'good' }));
      tick(2000);

      verify(suggestServiceMock.search('good')).once();
    }));

    it('should not fire action when error is encountered at service level', fakeAsync(() => {
      when(suggestServiceMock.search(anyString())).thenReturn(throwError({ message: 'ERROR' }));

      store$.dispatch(new SuggestSearch({ searchTerm: 'good' }));
      tick(4000);

      effects.suggestSearch$.subscribe(fail, fail, fail);

      verify(suggestServiceMock.search('good')).once();
    }));

    it('should fire all necessary actions for suggest-search', fakeAsync(() => {
      store$.dispatch(new SuggestSearch({ searchTerm: 'good' }));
      tick(500); // debounceTime
      expect(store$.actionsArray(/\[Suggest Search/)).toMatchInlineSnapshot(`
          [Suggest Search] Load Search Suggestions:
            searchTerm: "good"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "good"
            suggests: [{"term":"Goods"}]
        `);

      // 2nd term to because distinctUntilChanged
      store$.dispatch(new SuggestSearch({ searchTerm: 'goo' }));
      tick(500);
      expect(store$.actionsArray(/\[Suggest Search/)).toMatchInlineSnapshot(`
          [Suggest Search] Load Search Suggestions:
            searchTerm: "good"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "good"
            suggests: [{"term":"Goods"}]
          [Suggest Search] Load Search Suggestions:
            searchTerm: "goo"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "goo"
            suggests: [{"term":"Goods"}]
        `);

      // test cache: search->api->success & search->success->api->success
      store$.dispatch(new SuggestSearch({ searchTerm: 'good' }));
      tick(500);
      expect(store$.actionsArray(/\[Suggest Search/)).toMatchInlineSnapshot(`
          [Suggest Search] Load Search Suggestions:
            searchTerm: "good"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "good"
            suggests: [{"term":"Goods"}]
          [Suggest Search] Load Search Suggestions:
            searchTerm: "goo"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "goo"
            suggests: [{"term":"Goods"}]
          [Suggest Search] Load Search Suggestions:
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
      router.navigate(['search', searchTerm]);
      tick(500);

      verify(productsServiceMock.searchProducts(searchTerm, 1, anything())).once();

      store$.dispatch(new LoadMoreProducts({ id: { type: 'search', value: searchTerm }, page: 2 }));
      verify(productsServiceMock.searchProducts(searchTerm, 2, anything())).once();

      store$.dispatch(new LoadMoreProducts({ id: { type: 'search', value: searchTerm }, page: 3 }));
      verify(productsServiceMock.searchProducts(searchTerm, 3, anything())).once();
    }));
  });
});
