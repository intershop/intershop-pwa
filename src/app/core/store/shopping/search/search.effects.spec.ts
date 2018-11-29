import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { TestStore, ngrxTesting } from '../../../../utils/dev/ngrx-testing';
import { ENDLESS_SCROLLING_ITEMS_PER_PAGE } from '../../../configurations/injection-keys';
import { HttpError } from '../../../models/http-error/http-error.model';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';
import { ApiService } from '../../../services/api/api.service';
import { ProductsService } from '../../../services/products/products.service';
import { SuggestService } from '../../../services/suggest/suggest.service';
import { shoppingReducers } from '../shopping.system';
import { SetEndlessScrollingPageSize, SetPage, SetPagingLoading, ViewconfActionTypes } from '../viewconf';

import {
  PrepareNewSearch,
  SearchActionTypes,
  SearchMoreProducts,
  SearchProducts,
  SearchProductsFail,
  SuggestSearch,
} from './search.actions';
import { SearchEffects } from './search.effects';

describe('Search Effects', () => {
  let productsServiceMock: ProductsService;
  let suggestServiceMock: SuggestService;
  let routerMock: Router;

  beforeEach(() => {
    routerMock = mock(Router);
    suggestServiceMock = mock(SuggestService);
    const result = [{ type: undefined, term: 'Goods' }];
    when(suggestServiceMock.search(anyString())).thenReturn(of<SuggestTerm[]>(result));
    productsServiceMock = mock(ProductsService);
    const skus = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    when(productsServiceMock.searchProducts(anyString(), anyNumber(), anyNumber())).thenCall(
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
        imports: ngrxTesting({
          shopping: combineReducers(shoppingReducers),
        }),
        providers: [
          SearchEffects,
          provideMockActions(() => actions$),
          { provide: ApiService, useFactory: () => instance(mock(ApiService)) },
          { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
          { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
          { provide: Router, useFactory: () => instance(routerMock) },
          { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 3 },
        ],
      });

      effects = TestBed.get(SearchEffects);

      const store = TestBed.get(Store);
      store.dispatch(new SetEndlessScrollingPageSize(TestBed.get(ENDLESS_SCROLLING_ITEMS_PER_PAGE)));
    });

    describe('triggerSearch$', () => {
      it('should trigger SearchProducts action if search URL is matched', () => {
        const action = new RouteNavigation({
          path: 'search/:searchTerm',
          params: { searchTerm: 'dummy' },
          queryParams: [],
        });
        actions$ = hot('a', { a: action });

        expect(effects.triggerSearch$).toBeObservable(
          cold('(ab)', { a: new PrepareNewSearch(), b: new SearchProducts('dummy') })
        );
      });
    });

    describe('searchProducts$', () => {
      it('should perform a search with given search term when search is requested', done => {
        const searchTerm = '123';
        const action = new SearchProducts(searchTerm);
        actions$ = of(action);

        effects.searchProducts$.subscribe(() => {
          verify(productsServiceMock.searchProducts(anyString(), anyNumber(), anyNumber())).once();
          const [term, page, itemsPerPage] = capture(productsServiceMock.searchProducts).last();
          expect(term).toEqual('123');
          expect(page).toEqual(0);
          expect(itemsPerPage).toEqual(3);
          done();
        });
      });
    });

    describe('searchMoreProducts$', () => {
      it('should perform a continued search with given search term when search is requested', () => {
        const searchTerm = '123';
        const action = new SearchMoreProducts(searchTerm);
        actions$ = hot('a', { a: action });

        expect(effects.searchMoreProducts$).toBeObservable(
          cold('(abc)', {
            a: new SetPagingLoading(),
            b: new SetPage(1),
            c: new SearchProducts('123'),
          })
        );
      });
    });
  });

  describe('with fakeAsync', () => {
    let store$: TestStore;
    let effects: SearchEffects;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: ngrxTesting(
          {
            shopping: combineReducers(shoppingReducers),
          },
          [SearchEffects]
        ),
        providers: [
          { provide: ApiService, useFactory: () => instance(mock(ApiService)) },
          { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
          { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
          { provide: Router, useFactory: () => instance(routerMock) },
          { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 3 },
        ],
      });

      effects = TestBed.get(SearchEffects);
      store$ = TestBed.get(TestStore);

      store$.dispatch(new SetEndlessScrollingPageSize(TestBed.get(ENDLESS_SCROLLING_ITEMS_PER_PAGE)));
    });

    describe('suggestSearch$', () => {
      it('should not fire when search term is falsy', fakeAsync(() => {
        const action = new SuggestSearch(undefined);
        store$.dispatch(action);

        tick(5000);

        verify(suggestServiceMock.search(anyString())).never();
      }));

      it('should not fire when search term is empty', fakeAsync(() => {
        const action = new SuggestSearch('');
        store$.dispatch(action);

        tick(5000);

        verify(suggestServiceMock.search(anyString())).never();
      }));

      it('should return search terms when available', fakeAsync(() => {
        const action = new SuggestSearch('g');
        store$.dispatch(action);

        tick(5000);

        verify(suggestServiceMock.search(anyString())).once();
      }));

      it('should debounce correctly when search term is entered stepwise', fakeAsync(() => {
        store$.dispatch(new SuggestSearch('g'));
        tick(50);
        store$.dispatch(new SuggestSearch('goo'));
        tick(100);
        store$.dispatch(new SuggestSearch('good'));
        tick(200);

        verify(suggestServiceMock.search(anyString())).never();

        tick(400);
        verify(suggestServiceMock.search(anyString())).once();
      }));

      it('should send only once if search term is entered multiple times', fakeAsync(() => {
        store$.dispatch(new SuggestSearch('good'));
        tick(2000);
        verify(suggestServiceMock.search(anyString())).once();
        store$.dispatch(new SuggestSearch('good'));
        tick(2000);

        verify(suggestServiceMock.search(anyString())).once();
      }));

      it('should not fire action when error is encountered at service level', fakeAsync(() => {
        when(suggestServiceMock.search(anyString())).thenReturn(throwError({ message: 'ERROR' }));

        store$.dispatch(new SuggestSearch('good'));
        tick(4000);

        effects.suggestSearch$.subscribe(fail, fail, fail);

        const iter = store$.actionsIterator([/.*/]);
        expect(iter.next().type).toEqual(ViewconfActionTypes.SetEndlessScrollingPageSize);
        expect(iter.next().type).toEqual(SearchActionTypes.SuggestSearch);
        expect(iter.next()).toBeUndefined();

        verify(suggestServiceMock.search(anyString())).once();
      }));
    });

    describe('redirectIfSearchProductFail$', () => {
      it('should redirect if triggered', fakeAsync(() => {
        const action = new SearchProductsFail({ status: 404 } as HttpError);

        store$.dispatch(action);

        tick(4000);

        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/error']);
      }));
    });

    describe('searchProducts$', () => {
      it('should perform an additional search with given search term and trigger actions until maximum pages is reached', fakeAsync(() => {
        const searchTerm = '123';

        store$.dispatch(new SearchProducts(searchTerm));
        verify(productsServiceMock.searchProducts(searchTerm, 0, 3)).once();

        store$.dispatch(new SearchMoreProducts(searchTerm));
        verify(productsServiceMock.searchProducts(searchTerm, 1, 3)).once();

        store$.dispatch(new SearchMoreProducts(searchTerm));
        verify(productsServiceMock.searchProducts(searchTerm, 2, 3)).once();

        store$.dispatch(new SearchMoreProducts(searchTerm));
        verify(productsServiceMock.searchProducts(searchTerm, 3, 3)).never();
      }));
    });
  });
});
