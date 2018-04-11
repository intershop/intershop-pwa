import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreState } from '../core.state';
import { coreReducers } from '../core.system';
import { CommunicationTimeoutError, ErrorActionTypes } from './error.actions';
import { ErrorState } from './error.reducer';
import { getErrorState } from './error.selectors';

describe('Error Selectors', () => {
  let store$: Store<CoreState>;
  let getErrorState$: Observable<ErrorState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
    });

    store$ = TestBed.get(Store);

    getErrorState$ = store$.pipe(select(getErrorState));
  });

  it('should have nothing when just initialized', () => {
    getErrorState$.subscribe(error => expect(error).toBeNull());
  });

  it('should select a error when a HttpError action is reduced', () => {
    const httpResponse = {} as HttpErrorResponse;
    store$.dispatch(new CommunicationTimeoutError(httpResponse));

    getErrorState$.subscribe(error => {
      expect(error.type).toBe(ErrorActionTypes.TimeoutError);
      expect(error.current).toBe(httpResponse);
    });
  });
});
