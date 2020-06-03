import { TestBed } from '@angular/core/testing';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CoreStoreModule } from 'ish-core/store/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CommunicationTimeoutError } from './error.actions';
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
    store$.dispatch(new CommunicationTimeoutError({ error: { status: 123 } as HttpError }));

    expect(getGeneralError(store$.state)).toMatchInlineSnapshot(`
      Object {
        "status": 123,
      }
    `);
    expect(getGeneralErrorType(store$.state)).toMatchInlineSnapshot(`"[Error] Communication Timeout Error"`);
  });
});
