import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { noop } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { CommunicationTimeoutError } from './error.actions';
import { ErrorEffects } from './error.effects';

describe('Error Effects', () => {
  let effects: ErrorEffects;
  let store$: Store<{}>;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }]),
        ngrxTesting({ reducers: coreReducers }),
      ],
      providers: [ErrorEffects],
    });

    store$ = TestBed.get(Store);
    effects = TestBed.get(ErrorEffects);
    location = TestBed.get(Location);
  });

  describe('gotoErrorPageInCaseOfError$', () => {
    it('should call Router Navigation when Error is handled', fakeAsync(() => {
      store$.dispatch(new CommunicationTimeoutError({ error: {} as HttpError }));

      effects.gotoErrorPageInCaseOfError$.subscribe(noop, fail, fail);

      tick(500);

      expect(location.path()).toEqual('/error');
    }));
  });
});
