import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { PRODUCT_LISTING_ITEMS_PER_PAGE } from 'ish-core/configurations/injection-keys';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { SetProductListingPages } from 'ish-core/store/shopping/product-listing';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as fromActions from './filter.actions';
import { FilterEffects } from './filter.effects';

describe('Filter Effects', () => {
  let actions$: Observable<Action>;
  let effects: FilterEffects;
  let filterServiceMock: FilterService;

  const filterNav = {
    filter: [{ name: 'blubb', displayType: 'text_clear', facets: [{ name: 'a' }, { name: 'b' }] }],
  } as FilterNavigation;
  beforeEach(() => {
    filterServiceMock = mock(FilterService);
    when(filterServiceMock.getFilterForSearch(anything())).thenCall(a => {
      if (a === 'invalid') {
        return throwError({ message: 'invalid' });
      } else {
        return of(filterNav);
      }
    });
    when(filterServiceMock.getFilterForCategory(anything())).thenCall(a => {
      if (a === 'invalid') {
        return throwError({ message: 'invalid' });
      } else {
        return of(filterNav);
      }
    });

    when(filterServiceMock.getFilteredProducts(anything())).thenCall(a => {
      if (a.name === 'invalid') {
        return throwError({ message: 'invalid' });
      } else {
        return of({
          total: 2,
          productSKUs: ['123', '234'],
        });
      }
    });

    when(filterServiceMock.applyFilter(anyString())).thenCall(a => {
      if (a === 'invalid') {
        return throwError({ message: 'invalid' });
      } else {
        return of(filterNav);
      }
    });
    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
      providers: [
        FilterEffects,
        provideMockActions(() => actions$),
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 2 },
      ],
    });

    effects = TestBed.get(FilterEffects);
  });

  describe('loadAvailableFilterForCategories$', () => {
    it('should call the filterService for LoadFilterForCategories action', done => {
      const action = new fromActions.LoadFilterForCategory({ uniqueId: 'c' });
      actions$ = of(action);

      effects.loadAvailableFilterForCategories$.subscribe(() => {
        verify(filterServiceMock.getFilterForCategory(anything())).once();
        done();
      });
    });

    it('should map to action of type LoadFilterSuccess', () => {
      const action = new fromActions.LoadFilterForCategory({ uniqueId: 'c' });
      const completion = new fromActions.LoadFilterSuccess({ filterNavigation: filterNav });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAvailableFilterForCategories$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadFilterFail', () => {
      const action = new fromActions.LoadFilterForCategory({ uniqueId: 'invalid' });
      const completion = new fromActions.LoadFilterFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAvailableFilterForCategories$).toBeObservable(expected$);
    });
  });

  describe('applyFilter$', () => {
    it('should call the filterService for ApplyFilter action', done => {
      const action = new fromActions.ApplyFilter({ searchParameter: 'b' });
      actions$ = of(action);

      effects.applyFilter$.subscribe(() => {
        verify(filterServiceMock.applyFilter('b')).once();
        done();
      });
    });

    it('should map to action of type ApplyFilterSuccess', () => {
      const action = new fromActions.ApplyFilter({ searchParameter: 'b' });
      const completion = new fromActions.ApplyFilterSuccess({
        availableFilter: filterNav,
        searchParameter: 'b',
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.applyFilter$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type ApplyFilterFail', () => {
      const action = new fromActions.ApplyFilter({ searchParameter: 'invalid' });
      const completion = new fromActions.ApplyFilterFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.applyFilter$).toBeObservable(expected$);
    });
  });

  describe('loadFilteredProducts$', () => {
    it('should trigger product actions for ApplyFilterSuccess action', () => {
      const action = new fromActions.LoadProductsForFilter({
        id: {
          type: 'search',
          value: 'test',
          filters: 'b*',
        },
        searchParameter: 'b',
      });
      const completion = new SetProductListingPages({
        id: {
          type: 'search',
          value: 'test',
          filters: 'b*',
        },
        1: ['123', '234'],
        itemCount: 2,
        sortKeys: [],
      });
      actions$ = hot('        ---b-|', { b: action });
      const expected$ = cold('---c-|', { c: completion });
      expect(effects.loadFilteredProducts$).toBeObservable(expected$);
    });
  });

  describe('loadFilterForSearch$', () => {
    it('should call the filterService for LoadFilterForSearch action', done => {
      const action = new fromActions.LoadFilterForSearch({ searchTerm: 'search' });
      actions$ = of(action);

      effects.loadFilterForSearch$.subscribe(() => {
        verify(filterServiceMock.getFilterForSearch(anything())).once();
        done();
      });
    });

    it('should map to action of type LoadFilterSuccess', () => {
      const action = new fromActions.LoadFilterForSearch({ searchTerm: 'search' });
      const completion = new fromActions.LoadFilterSuccess({ filterNavigation: filterNav });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadFilterForSearch$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadFilterFail', () => {
      const action = new fromActions.LoadFilterForSearch({ searchTerm: 'invalid' });
      const completion = new fromActions.LoadFilterFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadFilterForSearch$).toBeObservable(expected$);
    });
  });
});
