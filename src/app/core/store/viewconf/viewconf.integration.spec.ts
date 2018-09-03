import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';

import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { coreReducers } from '../core.system';

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
    store$.dispatch({
      type: ROUTER_NAVIGATION_TYPE,
      payload: { data: { wrapperClass: 'something' } },
    } as Action);

    expect(getWrapperClass(store$.state)).toEqual('something');
  });

  it('should extract headerType from routing to state', () => {
    store$.dispatch({
      type: ROUTER_NAVIGATION_TYPE,
      payload: { data: { headerType: 'something' } },
    } as Action);

    expect(getHeaderType(store$.state)).toEqual('something');
  });

  it('should extract breadcrumbData from routing to state', () => {
    store$.dispatch({
      type: ROUTER_NAVIGATION_TYPE,
      payload: { data: { breadcrumbData: { text: 'TEXT' } } },
    } as Action);

    expect(getBreadcrumbData(store$.state)).toEqual({ text: 'TEXT' });
  });

  it('should reset wrapperClass when no longer available in routing data', () => {
    store$.dispatch({
      type: ROUTER_NAVIGATION_TYPE,
      payload: { data: { wrapperClass: 'something' } },
    } as Action);

    expect(getWrapperClass(store$.state)).toEqual('something');

    store$.dispatch({
      type: ROUTER_NAVIGATION_TYPE,
      payload: { data: {} },
    } as Action);

    expect(getWrapperClass(store$.state)).toBeUndefined();
  });
});
