import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { RouteNavigation } from 'ngrx-router';

import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { checkoutReducers } from '../checkout.system';

import { ViewconfEffects } from './viewconf.effects';
import { getCheckoutStep } from './viewconf.selectors';

describe('Viewconf Integration', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({ checkout: combineReducers(checkoutReducers) }, [ViewconfEffects]),
    });

    store$ = TestBed.get(TestStore);
  });

  it('should extract checkoutStep from routing data to store', () => {
    expect(getCheckoutStep(store$.state)).toBeUndefined();

    store$.dispatch(new RouteNavigation({ path: 'checkout', data: { checkoutStep: 1 } }));

    expect(getCheckoutStep(store$.state)).toBe(1);

    store$.dispatch(new RouteNavigation({ path: 'checkout', data: { checkoutStep: 2 } }));

    expect(getCheckoutStep(store$.state)).toBe(2);

    store$.dispatch(new RouteNavigation({ path: 'checkout', data: {} }));

    expect(getCheckoutStep(store$.state)).toBeUndefined();
  });
});
