import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { noop } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CoreStoreModule } from 'ish-core/store/core-store.module';

import { CommunicationTimeoutError } from './error.actions';
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
      store$.dispatch(new CommunicationTimeoutError({ error: {} as HttpError }));

      effects.gotoErrorPageInCaseOfError$.subscribe(noop, fail, fail);

      tick(500);

      expect(location.path()).toEqual('/error');
    }));
  });
});
