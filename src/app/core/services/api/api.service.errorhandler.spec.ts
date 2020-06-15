import { HttpHeaders } from '@angular/common/http';
import { TestBed, async } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import * as using from 'jasmine-data-provider';
import { cold } from 'jest-marbles';
import { noop } from 'rxjs';
import { anything, capture, spy, verify } from 'ts-mockito';

import { ErrorActionTypes } from 'ish-core/store/core/error';

import { ApiServiceErrorHandler } from './api.service.errorhandler';

describe('Api Service Errorhandler', () => {
  let apiServiceErrorHandler: ApiServiceErrorHandler;

  let store$: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    }).compileComponents();

    apiServiceErrorHandler = TestBed.inject(ApiServiceErrorHandler);
    store$ = spy(TestBed.inject(Store));
  }));

  function dataProviderKnown() {
    return [
      { error: { status: 0 }, expectedType: ErrorActionTypes.CommunicationTimeoutError },
      { error: { status: 500 }, expectedType: ErrorActionTypes.ServerError },
    ];
  }
  function dataProviderUnknown() {
    return [{ error: { status: 301 } }, { error: { status: 404 } }];
  }

  using(dataProviderUnknown, dataSlice => {
    it(`should delegate Error when Http Code ${dataSlice.error.status} is handled`, () => {
      const header = new HttpHeaders();
      dataSlice.error.headers = header;
      const result$ = apiServiceErrorHandler.dispatchCommunicationErrors(dataSlice.error);

      verify(store$.dispatch(anything())).never();
      expect(result$).toBeObservable(cold('#', undefined, dataSlice.error));
    });
  });

  using(dataProviderKnown, dataSlice => {
    it(`should create  state \'${dataSlice.expectedType}\' when Http Code ${dataSlice.error.status} is handled`, () => {
      const header = new HttpHeaders();
      dataSlice.error.headers = header;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(noop);
      apiServiceErrorHandler.dispatchCommunicationErrors(dataSlice.error);
      consoleSpy.mockRestore();

      verify(store$.dispatch(anything())).called();
      const [arg] = capture(store$.dispatch).last();
      expect((arg as Action).type).toBe(dataSlice.expectedType);
    });
  });
});
