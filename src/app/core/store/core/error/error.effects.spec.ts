import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { communicationTimeoutError } from './error.actions';
import { ErrorEffects } from './error.effects';

describe('Error Effects', () => {
  let store$: Store;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['error'], [ErrorEffects]),
        RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }]),
      ],
    });

    store$ = TestBed.inject(Store);
    location = TestBed.inject(Location);
  });

  it('should redirect to error page when general errors are encountered', fakeAsync(() => {
    store$.dispatch(communicationTimeoutError({ error: makeHttpError({}) }));

    tick(500);

    expect(location.path()).toEqual('/error');
  }));
});
