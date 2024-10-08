import { TestBed } from '@angular/core/testing';
import { anything } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { communicationTimeoutError } from './error.actions';
import { getGeneralError, getGeneralErrorType } from './error.selectors';

describe('Error Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['error'])],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  it('should have nothing when just initialized', () => {
    expect(getGeneralError(store$.state)).toBeUndefined();
    expect(getGeneralErrorType(store$.state)).toBeUndefined();
  });

  it('should return initialState when Action Login User Success is reduced on initial state', () => {
    store$.dispatch(loginUserSuccess(anything()));

    expect(getGeneralError(store$.state)).toBeUndefined();
    expect(getGeneralErrorType(store$.state)).toBeUndefined();
  });

  it('should select a error when a HttpError action is reduced', () => {
    store$.dispatch(communicationTimeoutError({ error: makeHttpError({ status: 123 }) }));

    expect(getGeneralError(store$.state)).toMatchInlineSnapshot(`
      {
        "name": "HttpErrorResponse",
        "status": 123,
      }
    `);
    expect(getGeneralErrorType(store$.state)).toMatchInlineSnapshot(`"[Error Internal] Communication Timeout Error"`);
  });
});
