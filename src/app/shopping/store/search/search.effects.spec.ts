import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerReducer } from '@ngrx/router-store';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyString, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { navigateMockAction } from '../../../utils/dev/navigate-mock.action';
import { SearchService } from '../../services/products/search.service';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import { DoSearch } from './search.actions';
import { SearchEffects } from './search.effects';

describe('SearchEffects', () => {
  let actions$: Observable<Action>;
  let effects: SearchEffects;
  let store$: Store<ShoppingState>;
  let apiMock: ApiService;
  let searchServiceMock: SearchService;

  beforeEach(() => {
    apiMock = mock(ApiService);
    actions$ = new Observable<Action>();

    searchServiceMock = mock(SearchService);
    when(searchServiceMock.searchForProductSkus(anyString()))
      .thenCall((searchTerm: string) => {
        if (!searchTerm) {
          return _throw('');
        } else {
          return of('Product SKU 1');
        }
      });

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          routerReducer
        }),
      ],
      providers: [
        SearchEffects,
        SearchService,
        provideMockActions(() => actions$),
        { provide: ApiService, useFactory: () => instance(apiMock) },
        { provide: SearchService, useFactory: () => instance(searchServiceMock) },

      ],
    });

    effects = TestBed.get(SearchEffects);
    store$ = TestBed.get(Store);
  });

  describe('triggerSearch$', () => {
    it('should trigger DoSearch action if search URL', () => {

      const routerAction = navigateMockAction({ url: '/search', queryParams: { SearchTerm: 'dummy' } });
      store$.dispatch(routerAction);

      expect(effects.triggerSearch$).toBeObservable(cold('a', { a: new DoSearch('dummy') }));
    });
  });

  describe('performSearch$', () => {
    it('should perform a search with given search term and trigger actions when search is requested', () => {
      const searchTerm = '123';
      const action = new DoSearch(searchTerm);
      actions$ = hot('a', { a: action });

      effects.performSearch$.subscribe(() => {
        verify(searchServiceMock.searchForProductSkus(searchTerm)).once();
      });
    });
  });

});
