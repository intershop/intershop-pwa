import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, combineReducers } from '@ngrx/store';
import { RouteNavigation } from 'ngrx-router';

import { LogEffects } from '../../../utils/dev/log.effects';
import { checkoutReducers } from '../checkout.system';

import { ViewconfEffects } from './viewconf.effects';
import { getCheckoutStep } from './viewconf.selectors';

describe('Viewconf Integration', () => {
  let store$: LogEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
        }),
        EffectsModule.forRoot([ViewconfEffects, LogEffects]),
      ],
    });

    store$ = TestBed.get(LogEffects);
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
