import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import * as using from 'jasmine-data-provider';
import { cold } from 'jasmine-marbles';
import { anything, capture, instance, mock, verify } from 'ts-mockito/lib/ts-mockito';
import { CoreState } from '../store/core.state';
import { ErrorActionTypes } from '../store/error';
import { ApiServiceErrorHandler } from './api.service.errorhandler';

describe('ApiServiceErrorHandler dispatchCommunicationErrors Method', () => {

  let apiServiceErrorHandler: ApiServiceErrorHandler;

  let storeMock: Store<CoreState>;

  beforeEach(async(() => {

    storeMock = mock(Store);
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [

        { provide: Store, useFactory: () => instance(storeMock) },
        ApiServiceErrorHandler
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    apiServiceErrorHandler = TestBed.get(ApiServiceErrorHandler);
  }));

  function dataProviderKnown() {
    return [
      { error: { status: 0 }, expectedType: ErrorActionTypes.TimeoutError },
      { error: { status: 500 }, expectedType: ErrorActionTypes.InternalServerError },
      { error: { status: 501 }, expectedType: ErrorActionTypes.NotImplementedError },
      { error: { status: 502 }, expectedType: ErrorActionTypes.BadGatewayError },
      { error: { status: 503 }, expectedType: ErrorActionTypes.ServiceUnavailableError },
      { error: { status: 504 }, expectedType: ErrorActionTypes.GatewayTimeoutError },
      { error: { status: 505 }, expectedType: ErrorActionTypes.HttpVersionNotSupportedError },
      { error: { status: 506 }, expectedType: ErrorActionTypes.VariantAlsoNegotiatesError },
      { error: { status: 507 }, expectedType: ErrorActionTypes.InsufficientStorageError },
      { error: { status: 508 }, expectedType: ErrorActionTypes.LoopDetectedError },
      { error: { status: 509 }, expectedType: ErrorActionTypes.BandwidthLimitExceededError },
      { error: { status: 510 }, expectedType: ErrorActionTypes.NotExtendedError },
      { error: { status: 511 }, expectedType: ErrorActionTypes.NetworkAuthenticationRequiredError },
    ];
  }
  function dataProviderUnknown() {
    return [
      { error: { status: 301 } },
      { error: { status: 404 } }
    ];
  }

  using(dataProviderUnknown, (dataSlice) => {
    it(`should delegate Error when Http Code ${dataSlice.error.status} is handled`, () => {
      const result$ = apiServiceErrorHandler.dispatchCommunicationErrors(dataSlice.error);

      verify(storeMock.dispatch(anything())).never();
      expect(result$).toBeObservable(cold('#', null, dataSlice.error));
    });
  });

  using(dataProviderKnown, (dataSlice) => {
    it(`should create  state \' ${dataSlice.expectedType} \')  when Http Code ${dataSlice.error.status} is handled`, () => {
      apiServiceErrorHandler.dispatchCommunicationErrors(dataSlice.error);

      verify(storeMock.dispatch(anything())).called();
      const [arg] = capture(storeMock.dispatch).last();
      expect((arg as Action).type).toBe(dataSlice.expectedType);
    });
  });
});
