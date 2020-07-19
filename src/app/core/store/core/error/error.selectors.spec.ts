import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
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

  it('should select a error when a HttpError action is reduced', () => {
    store$.dispatch(communicationTimeoutError({ error: makeHttpError({ status: 123 }) }));

    expect(getGeneralError(store$.state)).toMatchInlineSnapshot(`
      Object {
        "name": "HttpErrorResponse",
        "status": 123,
      }
    `);
    expect(getGeneralErrorType(store$.state)).toMatchInlineSnapshot(`"[Error] Communication Timeout Error"`);
  });
});
