import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { noop } from 'rxjs';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { communicationTimeoutError } from './error.actions';
import { ErrorEffects } from './error.effects';

describe('Error Effects', () => {
  let effects: ErrorEffects;
  let store$: Store;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['error']),
        RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }]),
      ],
      providers: [ErrorEffects],
    });

    store$ = TestBed.inject(Store);
    effects = TestBed.inject(ErrorEffects);
    location = TestBed.inject(Location);
  });

  describe('gotoErrorPageInCaseOfError$', () => {
    it('should call Router Navigation when Error is handled', fakeAsync(() => {
      store$.dispatch(communicationTimeoutError({ error: makeHttpError({}) }));

      effects.gotoErrorPageInCaseOfError$.subscribe(noop, fail, fail);

      tick(500);

      expect(location.path()).toEqual('/error');
    }));
  });
});
