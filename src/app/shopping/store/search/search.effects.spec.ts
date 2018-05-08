import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, Scheduler, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';
import { ProductsService } from '../../services/products/products.service';
import { SuggestService } from '../../services/suggest/suggest.service';
import { SearchProducts, SearchProductsFail, SuggestSearch, SuggestSearchSuccess } from './search.actions';
import { SearchEffects } from './search.effects';

describe('Search Effects', () => {
  let actions$: Observable<Action>;
  let effects: SearchEffects;
  let apiMock: ApiService;
  let productsServiceMock: ProductsService;
  let suggestServiceMock: SuggestService;

  const router = mock(Router);

  beforeEach(() => {
    apiMock = mock(ApiService);
    actions$ = new Observable<Action>();

    productsServiceMock = mock(ProductsService);
    suggestServiceMock = mock(SuggestService);
    when(productsServiceMock.searchProducts(anyString())).thenCall((searchTerm: string) => {
      if (!searchTerm) {
        return throwError('');
      } else {
        return of('Product SKU 1');
      }
    });

    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        ProductsService,
        provideMockActions(() => actions$),
        { provide: ApiService, useFactory: () => instance(apiMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
        { provide: Scheduler, useFactory: getTestScheduler },
        { provide: Router, useFactory: () => instance(router) },
      ],
    });

    effects = TestBed.get(SearchEffects);
  });

  describe('triggerSearch$', () => {
    it('should trigger SearchProducts action if search URL is matched', () => {
      const action = new RouteNavigation({
        path: 'search/:searchTerm',
        params: { searchTerm: 'dummy' },
        queryParams: [],
      });
      actions$ = hot('a', { a: action });

      expect(effects.triggerSearch$).toBeObservable(cold('a', { a: new SearchProducts('dummy') }));
    });
  });

  describe('searchProducts$', () => {
    it('should perform a search with given search term and trigger actions when search is requested', () => {
      const searchTerm = '123';
      const action = new SearchProducts(searchTerm);
      actions$ = hot('a', { a: action });

      effects.searchProducts$.subscribe(() => {
        verify(productsServiceMock.searchProducts(searchTerm)).once();
      });
    });
  });

  describe('suggestSearch$', () => {
    it('should not fire when search term is falsy', () => {
      const action = new SuggestSearch(undefined);
      actions$ = hot('a', { a: action });

      expect(effects.suggestSearch$).toBeObservable(cold('-'));
      verify(suggestServiceMock.search(anyString())).never();
    });

    it('should not fire when search term is empty', () => {
      const action = new SuggestSearch('');
      actions$ = hot('a', { a: action });

      expect(effects.suggestSearch$).toBeObservable(cold('-'));
      verify(suggestServiceMock.search(anyString())).never();
    });

    it('should return search terms when available', () => {
      const result = [{ type: undefined, term: 'Goods' }];
      when(suggestServiceMock.search(anyString())).thenReturn(of<SuggestTerm[]>(result));

      const action = new SuggestSearch('g');
      actions$ = hot('a', { a: action });

      expect(effects.suggestSearch$).toBeObservable(
        cold('----------------------------------------a', { a: new SuggestSearchSuccess(result) })
      );

      verify(suggestServiceMock.search(anyString())).once();
    });

    it('should debounce correctly when search term is entered stepwise', () => {
      const result = [{ type: undefined, term: 'Goods' }];
      when(suggestServiceMock.search(anyString())).thenReturn(of<SuggestTerm[]>(result));

      actions$ = hot('--a---b----c', {
        a: new SuggestSearch('g'),
        b: new SuggestSearch('goo'),
        c: new SuggestSearch('good'),
      });

      expect(effects.suggestSearch$).toBeObservable(
        cold('---------------------------------------------------a', { a: new SuggestSearchSuccess(result) })
      );

      verify(suggestServiceMock.search(anyString())).once();
    });

    it('should send only once if search term is entered multiple times', () => {
      const result = [{ type: undefined, term: 'Goods' }];
      when(suggestServiceMock.search(anyString())).thenReturn(of<SuggestTerm[]>(result));

      actions$ = hot('a------------------------------------------------------b', {
        a: new SuggestSearch('good'),
        b: new SuggestSearch('good'),
      });

      expect(effects.suggestSearch$).toBeObservable(
        cold('----------------------------------------a-------------------------------------------------------', {
          a: new SuggestSearchSuccess(result),
        })
      );

      verify(suggestServiceMock.search(anyString())).once();
    });

    it('should not fire action when error is encountered at service level', () => {
      when(suggestServiceMock.search(anyString())).thenReturn(throwError(new HttpErrorResponse({ status: 500 })));

      actions$ = hot('a', { a: new SuggestSearch('good') });

      expect(effects.suggestSearch$).toBeObservable(
        cold('-----------------------------------------------------------------------------------------------')
      );

      verify(suggestServiceMock.search(anyString())).once();
    });
  });

  describe('redirectIfSearchProductFail$', () => {
    it(
      'should redirect if triggered',
      fakeAsync(() => {
        const action = new SearchProductsFail({ status: 404 } as HttpErrorResponse);

        actions$ = hot('a', { a: action });

        effects.redirectIfSearchProductFail$.subscribe(() => {
          verify(router.navigate(anything())).once();
          const [param] = capture(router.navigate).last();
          expect(param).toEqual(['/error']);
        });
      })
    );
  });
});
