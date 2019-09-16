import { TestBed } from '@angular/core/testing';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { CommunicationTimeoutError, ErrorActionTypes } from './error.actions';
import { ErrorState } from './error.reducer';
import { getErrorState } from './error.selectors';

describe('Error Selectors', () => {
  let store$: Store<{}>;
  let getErrorState$: Observable<ErrorState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ngrxTesting({ reducers: coreReducers })],
    });

    store$ = TestBed.get(Store);

    getErrorState$ = store$.pipe(select(getErrorState));
  });

  it('should have nothing when just initialized', done => {
    getErrorState$.subscribe(error => {
      expect(error).toBeUndefined();
      done();
    });
  });

  it('should select a error when a HttpError action is reduced', done => {
    store$.dispatch(new CommunicationTimeoutError({ error: { status: 123 } as HttpError }));

    getErrorState$.subscribe(error => {
      expect(error.type).toBe(ErrorActionTypes.TimeoutError);
      expect(error.current).toBeTruthy();
      expect(error.current.status).toEqual(123);
      done();
    });
  });
});
