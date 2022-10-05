import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, merge, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { setProductListingPageSize } from 'ish-core/store/shopping/product-listing';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import {
  applyFilter,
  applyFilterFail,
  applyFilterSuccess,
  loadFilterFail,
  loadFilterForCategory,
  loadFilterForMaster,
  loadFilterForSearch,
  loadFilterSuccess,
} from './filter.actions';
import { FilterEffects } from './filter.effects';

describe('Filter Effects', () => {
  let actions$: Observable<Action>;
  let effects: FilterEffects;
  let filterServiceMock: FilterService;

  const filterNav = {
    filter: [{ name: 'foobar', displayType: 'text_clear', facets: [{ name: 'a' }, { name: 'b' }] }],
  } as FilterNavigation;
  beforeEach(() => {
    filterServiceMock = mock(FilterService);
    when(filterServiceMock.getFilterForSearch(anything())).thenCall(a => {
      if (a === 'invalid') {
        return throwError(() => makeHttpError({ message: 'invalid' }));
      } else {
        return of(filterNav);
      }
    });
    when(filterServiceMock.getFilterForCategory(anything())).thenCall(a => {
      if (a === 'invalid') {
        return throwError(() => makeHttpError({ message: 'invalid' }));
      } else {
        return of(filterNav);
      }
    });
    when(filterServiceMock.getFilterForMaster(anything())).thenCall(a => {
      if (a === 'invalid') {
        return throwError(() => makeHttpError({ message: 'invalid' }));
      } else {
        return of(filterNav);
      }
    });

    when(filterServiceMock.applyFilter(anything())).thenCall(a => {
      if (a.param[0] === 'invalid') {
        return throwError(() => makeHttpError({ message: 'invalid' }));
      } else {
        return of(filterNav);
      }
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        FilterEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(FilterEffects);
    const store$ = TestBed.inject(Store);
    store$.dispatch(setProductListingPageSize({ itemsPerPage: 2 }));
  });

  describe('loadAvailableFilters$', () => {
    it('should call the filterService for LoadFilterForCategories action', done => {
      const action = loadFilterForCategory({ uniqueId: 'c' });

      actions$ = of(personalizationStatusDetermined, action);

      effects.loadAvailableFilters$.subscribe(() => {
        verify(filterServiceMock.getFilterForCategory(anything())).once();
        done();
      });
    });

    it('should call the filterService for loadFilterForSearch action', done => {
      const action = loadFilterForSearch({ searchTerm: 'c' });
      actions$ = of(personalizationStatusDetermined, action);

      effects.loadAvailableFilters$.subscribe(() => {
        verify(filterServiceMock.getFilterForSearch(anything())).once();
        done();
      });
    });

    it('should call the filterService for loadFilterForMaster action', done => {
      const action = loadFilterForMaster({ masterSKU: 'c' });
      actions$ = of(personalizationStatusDetermined, action);

      effects.loadAvailableFilters$.subscribe(() => {
        verify(filterServiceMock.getFilterForMaster(anything())).once();
        done();
      });
    });

    it('should map to action of type LoadFilterSuccess', () => {
      const action = loadFilterForCategory({ uniqueId: 'c' });
      const completion = loadFilterSuccess({ filterNavigation: filterNav });
      actions$ = hot('b-a-a-a', { a: action, b: personalizationStatusDetermined });
      const expected$ = cold('--c-c-c', { c: completion });

      expect(effects.loadAvailableFilters$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadFilterFail', () => {
      const action = loadFilterForCategory({ uniqueId: 'invalid' });
      const completion = loadFilterFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('b-a-a-a', { a: action, b: personalizationStatusDetermined });
      const expected$ = cold('--c-c-c', { c: completion });

      expect(effects.loadAvailableFilters$).toBeObservable(expected$);
    });

    it('should always have the latest filters emitting', fakeAsync(() => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      when(filterServiceMock.getFilterForMaster('master1')).thenReturn(of('filter master 1' as any).pipe(delay(10)));
      when(filterServiceMock.getFilterForMaster('master2')).thenReturn(of('filter master 2' as any).pipe(delay(100)));
      when(filterServiceMock.getFilterForCategory('category')).thenReturn(
        of('filter categories' as any).pipe(delay(1000))
      );
      /* eslint-enable @typescript-eslint/no-explicit-any */

      actions$ = merge(
        // go to master 1
        of(personalizationStatusDetermined, loadFilterForMaster({ masterSKU: 'master1' })),
        // go to category
        of(personalizationStatusDetermined, loadFilterForCategory({ uniqueId: 'category' })).pipe(delay(300)),
        // go to master 2 before category filters are loaded
        of(personalizationStatusDetermined, loadFilterForMaster({ masterSKU: 'master2' })).pipe(delay(500))
      );

      let lastAction;
      effects.loadAvailableFilters$.subscribe(action => {
        lastAction = action;
      });

      tick(200);

      expect(lastAction).toMatchInlineSnapshot(`
        [Filter API] Load Filter Success:
          filterNavigation: "filter master 1"
      `);

      tick(200);

      expect(lastAction).toMatchInlineSnapshot(`
        [Filter API] Load Filter Success:
          filterNavigation: "filter master 1"
      `);

      tick(200);

      expect(lastAction).toMatchInlineSnapshot(`
        [Filter API] Load Filter Success:
          filterNavigation: "filter master 2"
      `);

      tick(200);

      expect(lastAction).toMatchInlineSnapshot(`
        [Filter API] Load Filter Success:
          filterNavigation: "filter master 2"
      `);

      tick(200);

      expect(lastAction).toMatchInlineSnapshot(`
        [Filter API] Load Filter Success:
          filterNavigation: "filter master 2"
      `);

      tick(200);

      expect(lastAction).toMatchInlineSnapshot(`
        [Filter API] Load Filter Success:
          filterNavigation: "filter master 2"
      `);

      tick(200);

      expect(lastAction).toMatchInlineSnapshot(`
        [Filter API] Load Filter Success:
          filterNavigation: "filter master 2"
      `);
    }));
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
});
