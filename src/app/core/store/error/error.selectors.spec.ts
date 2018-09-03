import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HttpError } from '../../../models/http-error/http-error.model';
import { coreReducers } from '../core.system';

import { CommunicationTimeoutError, ErrorActionTypes } from './error.actions';
import { ErrorState } from './error.reducer';
import { getErrorState } from './error.selectors';

describe('Error Selectors', () => {
  let store$: Store<{}>;
  let getErrorState$: Observable<ErrorState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
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
    store$.dispatch(new CommunicationTimeoutError({ status: 123 } as HttpError));

    getErrorState$.subscribe(error => {
      expect(error.type).toBe(ErrorActionTypes.TimeoutError);
      expect(error.current).toBeTruthy();
      expect(error.current.status).toEqual(123);
      done();
    });
  });
});
