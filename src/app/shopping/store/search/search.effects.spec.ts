import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from '../../../core/services/api/api.service';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';
import { LogEffects } from '../../../utils/dev/log.effects';
import { ProductsService } from '../../services/products/products.service';
import { SuggestService } from '../../services/suggest/suggest.service';
import { SearchProducts, SearchProductsFail, SuggestSearch } from './search.actions';
import { SearchEffects } from './search.effects';
import { searchReducer } from './search.reducer';

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
    when(productsServiceMock.searchProducts(anyString())).thenCall((searchTerm: string) => {
      if (!searchTerm) {
        return throwError('');
      } else {
        return of('Product SKU 1');
      }
    });
  });

  describe('with marbles', () => {
    let actions$: Observable<Action>;
    let effects: SearchEffects;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          SearchEffects,
          provideMockActions(() => actions$),
          { provide: ApiService, useFactory: () => instance(mock(ApiService)) },
          { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
          { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
          { provide: Router, useFactory: () => instance(routerMock) },
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
  });

  describe('with fakeAsync', () => {
    let store$: LogEffects;
    let effects: SearchEffects;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({
            search: combineReducers(searchReducer),
          }),
          EffectsModule.forRoot([SearchEffects, LogEffects]),
        ],
        providers: [
          { provide: ApiService, useFactory: () => instance(mock(ApiService)) },
          { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
          { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
          { provide: Router, useFactory: () => instance(routerMock) },
        ],
      });

      effects = TestBed.get(SearchEffects);
      store$ = TestBed.get(LogEffects);
    });

    describe('suggestSearch$', () => {
      it(
        'should not fire when search term is falsy',
        fakeAsync(() => {
          const action = new SuggestSearch(undefined);
          store$.dispatch(action);

          tick(5000);

          verify(suggestServiceMock.search(anyString())).never();
        })
      );

      it(
        'should not fire when search term is empty',
        fakeAsync(() => {
          const action = new SuggestSearch('');
          store$.dispatch(action);

          tick(5000);

          verify(suggestServiceMock.search(anyString())).never();
        })
      );

      it(
        'should return search terms when available',
        fakeAsync(() => {
          const action = new SuggestSearch('g');
          store$.dispatch(action);

          tick(5000);

          verify(suggestServiceMock.search(anyString())).once();
        })
      );

      it(
        'should debounce correctly when search term is entered stepwise',
        fakeAsync(() => {
          store$.dispatch(new SuggestSearch('g'));
          tick(50);
          store$.dispatch(new SuggestSearch('goo'));
          tick(100);
          store$.dispatch(new SuggestSearch('good'));
          tick(200);

          verify(suggestServiceMock.search(anyString())).never();

          tick(400);
          verify(suggestServiceMock.search(anyString())).once();
        })
      );

      it(
        'should send only once if search term is entered multiple times',
        fakeAsync(() => {
          store$.dispatch(new SuggestSearch('good'));
          tick(2000);
          verify(suggestServiceMock.search(anyString())).once();
          store$.dispatch(new SuggestSearch('good'));
          tick(2000);

          verify(suggestServiceMock.search(anyString())).once();
        })
      );

      it(
        'should not fire action when error is encountered at service level',
        fakeAsync(() => {
          when(suggestServiceMock.search(anyString())).thenReturn(throwError(new HttpErrorResponse({ status: 500 })));

          store$.dispatch(new SuggestSearch('good'));
          tick(4000);

          effects.suggestSearch$.subscribe(() => fail(), () => fail(), () => fail());

          const iter = store$.actionsIterator([/.*/]);
          iter.next();
          expect(iter.next()).toBeUndefined();

          verify(suggestServiceMock.search(anyString())).once();
        })
      );
    });

    describe('redirectIfSearchProductFail$', () => {
      it(
        'should redirect if triggered',
        fakeAsync(() => {
          const action = new SearchProductsFail({ status: 404 } as HttpErrorResponse);

          store$.dispatch(action);

          tick(4000);

          verify(routerMock.navigate(anything())).once();
          const [param] = capture(routerMock.navigate).last();
          expect(param).toEqual(['/error']);
        })
      );
    });
  });
});
