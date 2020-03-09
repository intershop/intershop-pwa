import { TestBed } from '@angular/core/testing';
import { RouteNavigation } from 'ngrx-router';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ViewconfEffects } from './viewconf.effects';
import { getBreadcrumbData, getHeaderType, getWrapperClass } from './viewconf.selectors';

describe('Viewconf Integration', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({ reducers: coreReducers, effects: [ViewconfEffects] }),
      providers: [
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    });

    store$ = TestBed.get(TestStore);
  });

  it('should extract wrapperClass from routing to state', () => {
    store$.dispatch(new RouteNavigation({ path: 'any', data: { wrapperClass: 'something' } }));

    expect(getWrapperClass(store$.state)).toEqual('something');
  });

  it('should extract headerType from routing to state', () => {
    store$.dispatch(new RouteNavigation({ path: 'any', data: { headerType: 'something' } }));

    expect(getHeaderType(store$.state)).toEqual('something');
  });

  it('should extract breadcrumbData from routing to state', () => {
    store$.dispatch(new RouteNavigation({ path: 'any', data: { breadcrumbData: [{ text: 'TEXT' }] } }));

    expect(getBreadcrumbData(store$.state)).toEqual([{ text: 'TEXT' }]);
  });

  it('should reset wrapperClass when no longer available in routing data', () => {
    store$.dispatch(new RouteNavigation({ path: 'any', data: { wrapperClass: 'something' } }));

    expect(getWrapperClass(store$.state)).toEqual('something');

    store$.dispatch(new RouteNavigation({ path: 'any' }));

    expect(getWrapperClass(store$.state)).toBeUndefined();
  });
});
