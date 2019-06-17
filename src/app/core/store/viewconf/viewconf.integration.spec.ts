import { TestBed } from '@angular/core/testing';
import { RouteNavigation } from 'ngrx-router';

import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { coreReducers } from '../core-store.module';

import { ViewconfEffects } from './viewconf.effects';
import { getBreadcrumbData, getHeaderType, getWrapperClass } from './viewconf.selectors';

describe('Viewconf Integration', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting(coreReducers, [ViewconfEffects]),
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

    store$.dispatch(new RouteNavigation({ path: 'any', data: {} }));

    expect(getWrapperClass(store$.state)).toBeUndefined();
  });
});
