import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import {
  applyFilter,
  applyFilterFail,
  applyFilterSuccess,
  loadFilterFail,
  loadFilterForCategory,
  loadFilterForSearch,
  loadFilterSuccess,
  loadProductsForFilter,
} from './filter.actions';
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
        return throwError(makeHttpError({ message: 'invalid' }));
      } else {
        return of(filterNav);
      }
    });
    when(filterServiceMock.getFilterForCategory(anything())).thenCall(a => {
      if (a === 'invalid') {
        return throwError(makeHttpError({ message: 'invalid' }));
      } else {
        return of(filterNav);
      }
    });

    when(filterServiceMock.getFilteredProducts(anything(), anything(), anything())).thenCall(a => {
      if (a.name === 'invalid') {
        return throwError(makeHttpError({ message: 'invalid' }));
      } else {
        return of({
          total: 2,
          products: [{ sku: '123' }, { sku: '234' }],
        });
      }
    });

    when(filterServiceMock.applyFilter(anything())).thenCall(a => {
      if (a.param[0] === 'invalid') {
        return throwError(makeHttpError({ message: 'invalid' }));
      } else {
        return of(filterNav);
      }
    });
    TestBed.configureTestingModule({
      providers: [
        FilterEffects,
        provideMockActions(() => actions$),
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
      ],
    });

    effects = TestBed.inject(FilterEffects);
  });

  describe('loadAvailableFilterForCategories$', () => {
    it('should call the filterService for LoadFilterForCategories action', done => {
      const action = loadFilterForCategory({ uniqueId: 'c' });
      actions$ = of(action);

      effects.loadAvailableFilterForCategories$.subscribe(() => {
        verify(filterServiceMock.getFilterForCategory(anything())).once();
        done();
      });
    });

    it('should map to action of type LoadFilterSuccess', () => {
      const action = loadFilterForCategory({ uniqueId: 'c' });
      const completion = loadFilterSuccess({ filterNavigation: filterNav });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAvailableFilterForCategories$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadFilterFail', () => {
      const action = loadFilterForCategory({ uniqueId: 'invalid' });
      const completion = loadFilterFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAvailableFilterForCategories$).toBeObservable(expected$);
    });
  });

  describe('applyFilter$', () => {
    it('should call the filterService for ApplyFilter action', done => {
      const action = applyFilter({ searchParameter: { param: ['b'] } });
      actions$ = of(action);

      effects.applyFilter$.subscribe(() => {
        verify(filterServiceMock.applyFilter(deepEqual({ param: ['b'] }))).once();
        done();
      });
    });

    it('should map to action of type ApplyFilterSuccess', () => {
      const action = applyFilter({ searchParameter: { param: ['b'] } });
      const completion = applyFilterSuccess({
        availableFilter: filterNav,
        searchParameter: { param: ['b'] },
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.applyFilter$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type ApplyFilterFail', () => {
      const action = applyFilter({ searchParameter: { param: ['invalid'] } });
      const completion = applyFilterFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.applyFilter$).toBeObservable(expected$);
    });
  });

  describe('loadFilteredProducts$', () => {
    it('should trigger product actions for ApplyFilterSuccess action', done => {
      const action = loadProductsForFilter({
        id: {
          type: 'search',
          value: 'test',
          filters: { searchTerm: ['b*'] },
        },
        searchParameter: { param: ['b'] },
      });

      actions$ = of(action);
      effects.loadFilteredProducts$.pipe(toArray()).subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`
          [Products API] Load Product Success:
            product: {"sku":"123"}
          [Products API] Load Product Success:
            product: {"sku":"234"}
          [Product Listing Internal] Set Product Listing Pages:
            1: ["123","234"]
            id: {"type":"search","value":"test","filters":{"searchTerm":[1]}}
            itemCount: 2
            sortableAttributes: []
        `);
        done();
      });
    });
  });

  describe('loadFilterForSearch$', () => {
    it('should call the filterService for LoadFilterForSearch action', done => {
      const action = loadFilterForSearch({ searchTerm: 'search' });
      actions$ = of(action);

      effects.loadFilterForSearch$.subscribe(() => {
        verify(filterServiceMock.getFilterForSearch(anything())).once();
        done();
      });
    });

    it('should map to action of type LoadFilterSuccess', () => {
      const action = loadFilterForSearch({ searchTerm: 'search' });
      const completion = loadFilterSuccess({ filterNavigation: filterNav });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadFilterForSearch$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadFilterFail', () => {
      const action = loadFilterForSearch({ searchTerm: 'invalid' });
      const completion = loadFilterFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadFilterForSearch$).toBeObservable(expected$);
    });
  });
});
