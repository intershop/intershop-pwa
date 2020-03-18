import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ViewconfEffects } from './viewconf.effects';
import { getCheckoutStep } from './viewconf.selectors';

describe('Viewconf Integration', () => {
  let store$: TestStore;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        ...ngrxTesting({
          reducers: { checkout: combineReducers(checkoutReducers) },
          effects: [ViewconfEffects],
          routerStore: true,
        }),
        RouterTestingModule.withRoutes([
          {
            path: 'checkout',
            children: [
              { path: 'step1', data: { checkoutStep: 1 }, component: DummyComponent },
              { path: 'step2', data: { checkoutStep: 2 }, component: DummyComponent },
            ],
          },
          { path: '**', component: DummyComponent },
        ]),
      ],
    });

    store$ = TestBed.get(TestStore);
    router = TestBed.get(Router);
  });

  it('should extract checkoutStep from routing data to store', fakeAsync(() => {
    expect(getCheckoutStep(store$.state)).toBeUndefined();

    router.navigateByUrl('checkout/step1');
    tick(500);

    expect(getCheckoutStep(store$.state)).toBe(1);

    router.navigateByUrl('checkout/step2');
    tick(500);

    expect(getCheckoutStep(store$.state)).toBe(2);

    router.navigateByUrl('other');
    tick(500);

    expect(getCheckoutStep(store$.state)).toBeUndefined();
  }));
});
