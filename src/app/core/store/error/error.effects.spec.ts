import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { noop } from 'rxjs';
import { mock } from 'ts-mockito';

import { HttpError } from '../../models/http-error/http-error.model';
import { coreReducers } from '../core-store.module';

import { CommunicationTimeoutError } from './error.actions';
import { ErrorEffects } from './error.effects';

describe('Error Effects', () => {
  let effects: ErrorEffects;
  let store$: Store<{}>;
  let location: Location;

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    store$ = mock(Store);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'error', component: DummyComponent }]),
        StoreModule.forRoot(coreReducers),
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
