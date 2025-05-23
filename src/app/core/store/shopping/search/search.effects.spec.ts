import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { ProductsServiceProvider } from 'ish-core/service-provider/products.service-provider';
import { ProductsService } from 'ish-core/services/products/products.service';
import { SparqueSuggestionsService } from 'ish-core/services/sparque-suggestions/sparque-suggestions.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { loadMoreProducts, setProductListingPageSize } from 'ish-core/store/shopping/product-listing';
import { ProductListingEffects } from 'ish-core/store/shopping/product-listing/product-listing.effects';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

import { searchProductsFail, suggestSearch } from './search.actions';
import { SearchEffects } from './search.effects';

describe('Search Effects', () => {
  let store$: StoreWithSnapshots;
  let effects: SearchEffects;
  let router: Router;
  let productsServiceMock: ProductsService;
  let suggestServiceMock: SuggestService;
  let sparqueSuggestionsServiceMock: SparqueSuggestionsService;
  let productsServiceProviderMock: ProductsServiceProvider;
  let httpStatusCodeService: HttpStatusCodeService;

  const suggests = { suggestions: { keywords: [{ keyword: 'Goods' }] } };

  beforeEach(() => {
    sparqueSuggestionsServiceMock = mock(SparqueSuggestionsService);
    suggestServiceMock = mock(SuggestService);
    when(suggestServiceMock.searchSuggestions(anyString())).thenReturn(of(suggests));
    productsServiceMock = mock(ProductsService);
    productsServiceProviderMock = mock(ProductsServiceProvider);
    when(productsServiceProviderMock.get()).thenReturn(instance(productsServiceMock));
    const skus = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    when(productsServiceMock.searchProducts(anything())).thenCall(
      (searchTerm: string, amount: number, _, offset: number) => {
        if (!searchTerm) {
          return throwError(() => makeHttpError({ message: 'ERROR' }));
        } else {
          const currentSlice = skus.slice(offset, amount + offset);
          return of({
            products: currentSlice.map(sku => ({ sku })),
            sortKeys: [],
            total: skus.length,
          });
        }
      }
    );

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router', 'configuration'], [SearchEffects, ProductListingEffects]),
        RouterTestingModule.withRoutes([
          { path: 'error', children: [] },
          { path: 'search/:searchTerm', children: [] },
        ]),
        ShoppingStoreModule.forTesting('productListing'),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ProductsServiceProvider, useFactory: () => instance(productsServiceProviderMock) },
        { provide: SparqueSuggestionsService, useFactory: () => instance(sparqueSuggestionsServiceMock) },
        { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
        provideStoreSnapshots(),
      ],
    });

    effects = TestBed.inject(SearchEffects);
    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
    httpStatusCodeService = spy(TestBed.inject(HttpStatusCodeService));

    store$.dispatch(setProductListingPageSize({ itemsPerPage: 12 }));
    store$.dispatch(personalizationStatusDetermined());
  });

  describe('triggerSearch$', () => {
    it('should trigger actions if search URL is matched', fakeAsync(() => {
      router.navigateByUrl('/search/dummy');

      tick(200);

      expect(store$.actionsArray(/Load More Products/)).toMatchInlineSnapshot(`
        [Product Listing] Load More Products:
          id: {"type":"search","value":"dummy"}
        [Product Listing Internal] Load More Products For Params:
          id: {"type":"search","value":"dummy"}
          filters: undefined
          sorting: undefined
          page: undefined
      `);
    }));
  });

  describe('suggestSearch$', () => {
    it('should return search terms when available', fakeAsync(() => {
      const action = suggestSearch({ searchTerm: 'g' });
      store$.dispatch(action);

      verify(suggestServiceMock.searchSuggestions('g')).once();
    }));

    it('should not fire action when error is encountered at service level', fakeAsync(() => {
      when(suggestServiceMock.searchSuggestions(anyString())).thenReturn(
        throwError(() => makeHttpError({ message: 'ERROR' }))
      );

      store$.dispatch(suggestSearch({ searchTerm: 'good' }));
      tick(4000);

      effects.suggestSearch$.subscribe({ next: fail, error: fail });

      verify(suggestServiceMock.searchSuggestions('good')).once();
    }));

    it('should fire all necessary actions for suggest-search', fakeAsync(() => {
      store$.dispatch(suggestSearch({ searchTerm: 'good' }));
      tick(500); // debounceTime
      expect(store$.actionsArray(/\[Suggest Search/)).toMatchInlineSnapshot(`
        [Suggest Search] Load Search Suggestions:
          searchTerm: "good"
        [Suggest Search API] Return Search Suggestions:
          suggestions: {"keywords":[1]}
      `);

      // 2nd term to because distinctUntilChanged
      store$.dispatch(suggestSearch({ searchTerm: 'goo' }));
      tick(500);
      expect(store$.actionsArray(/\[Suggest Search/)).toMatchInlineSnapshot(`
        [Suggest Search] Load Search Suggestions:
          searchTerm: "good"
        [Suggest Search API] Return Search Suggestions:
          suggestions: {"keywords":[1]}
        [Suggest Search] Load Search Suggestions:
          searchTerm: "goo"
        [Suggest Search API] Return Search Suggestions:
          suggestions: {"keywords":[1]}
      `);

      // test cache: search->api->success & search->success->api->success
      store$.dispatch(suggestSearch({ searchTerm: 'good' }));
      tick(500);
      expect(store$.actionsArray(/\[Suggest Search/)).toMatchInlineSnapshot(`
        [Suggest Search] Load Search Suggestions:
          searchTerm: "good"
        [Suggest Search API] Return Search Suggestions:
          suggestions: {"keywords":[1]}
        [Suggest Search] Load Search Suggestions:
          searchTerm: "goo"
        [Suggest Search API] Return Search Suggestions:
          suggestions: {"keywords":[1]}
        [Suggest Search] Load Search Suggestions:
          searchTerm: "good"
        [Suggest Search API] Return Search Suggestions:
          suggestions: {"keywords":[1]}
      `);
    }));
  });

  describe('redirectIfSearchProductFail$', () => {
    it('should redirect if triggered', fakeAsync(() => {
      store$.dispatch(searchProductsFail({ error: makeHttpError({ status: 404 }) }));

      tick(4000);

      verify(httpStatusCodeService.setStatus(anything())).once();
      expect(capture(httpStatusCodeService.setStatus).last()).toMatchInlineSnapshot(`
        [
          404,
        ]
      `);
    }));
  });

  describe('searchProducts$', () => {
    it('should perform an additional search for given search term and trigger actions', fakeAsync(() => {
      const searchTerm = '123';
      router.navigate(['search', searchTerm]);
      tick(500);

      verify(productsServiceMock.searchProducts(anything())).once();
      expect(capture(productsServiceMock.searchProducts).last()).toMatchInlineSnapshot(`
        [
          {
            "amount": 12,
            "offset": 0,
            "searchTerm": "123",
            "sorting": undefined,
          },
        ]
      `);

      store$.dispatch(loadMoreProducts({ id: { type: 'search', value: searchTerm }, page: 2 }));
      tick(5);
      verify(productsServiceMock.searchProducts(anything())).times(2);

      expect(capture(productsServiceMock.searchProducts).last()).toMatchInlineSnapshot(`
        [
          {
            "amount": 12,
            "offset": 12,
            "searchTerm": "123",
            "sorting": undefined,
          },
        ]
      `);

      store$.dispatch(loadMoreProducts({ id: { type: 'search', value: searchTerm }, page: 3 }));
      tick(5);
      verify(productsServiceMock.searchProducts(anything())).times(3);
      expect(capture(productsServiceMock.searchProducts).last()).toMatchInlineSnapshot(`
        [
          {
            "amount": 12,
            "offset": 24,
            "searchTerm": "123",
            "sorting": undefined,
          },
        ]
      `);
    }));
  });
});
