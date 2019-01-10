import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { HttpError } from '../../models/http-error/http-error.model';
import { coreReducers } from '../core-store.module';

import { CommunicationTimeoutError } from './error.actions';
import { ErrorEffects } from './error.effects';

describe('Error Effects', () => {
  let effects: ErrorEffects;
  let routerMock: Router;
  let store$: Store<{}>;

  beforeEach(() => {
    routerMock = mock(Router);
    store$ = mock(Store);

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
      providers: [ErrorEffects, Store, { provide: Router, useFactory: () => instance(routerMock) }],
    });

    store$ = TestBed.get(Store);
    effects = TestBed.get(ErrorEffects);
  });

  describe('gotoErrorPageInCaseOfError$', () => {
    it('should call Router Navigation when Error is handled', done => {
      store$.dispatch(new CommunicationTimeoutError({ error: {} as HttpError }));

      effects.gotoErrorPageInCaseOfError$.subscribe(() => {
        verify(routerMock.navigate(anything())).once();
        const [param] = capture(routerMock.navigate).last();
        expect(param).toEqual(['/error']);
        done();
      });
    });
  });
});
