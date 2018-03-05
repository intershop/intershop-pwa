import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import * as using from 'jasmine-data-provider';
import { ApiServiceErrorHandler } from './api.service.errorhandler';
import { CoreState, ErrorActionTypes } from '../store/error';
import { async, TestBed } from '@angular/core/testing';
import { mock, instance, verify, anything, capture } from 'ts-mockito/lib/ts-mockito';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


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
      { error: { status: 0 }, expectedType: ErrorActionTypes.timeoutError },
      { error: { status: 500 }, expectedType: ErrorActionTypes.internalServerError },
      { error: { status: 501 }, expectedType: ErrorActionTypes.notImplementedError },
      { error: { status: 502 }, expectedType: ErrorActionTypes.badGatewayError },
      { error: { status: 503 }, expectedType: ErrorActionTypes.serviceUnavailableError },
      { error: { status: 504 }, expectedType: ErrorActionTypes.gatewayTimeoutError },
      { error: { status: 505 }, expectedType: ErrorActionTypes.httpVersionNotSupportedError },
      { error: { status: 506 }, expectedType: ErrorActionTypes.variantAlsoNegotiatesError },
      { error: { status: 507 }, expectedType: ErrorActionTypes.insufficientStorageError },
      { error: { status: 508 }, expectedType: ErrorActionTypes.loopDetectedError },
      { error: { status: 509 }, expectedType: ErrorActionTypes.bandwidthLimitExceededError },
      { error: { status: 510 }, expectedType: ErrorActionTypes.notExtendedError },
      { error: { status: 511 }, expectedType: ErrorActionTypes.networkAuthenticationRequiredError },
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
      const result = apiServiceErrorHandler.dispatchCommunicationErrors(dataSlice.error);

      verify(storeMock.dispatch(anything())).never();
      expect(result).toBeTruthy();
      expect(result.constructor.name).toBe('ErrorObservable');


    });
  });

  using(dataProviderKnown, (dataSlice) => {
    it(`should create  state \' ${dataSlice.expectedType} \')  when Http Code ${dataSlice.error.status} is handled`, () => {
      const result = apiServiceErrorHandler.dispatchCommunicationErrors(dataSlice.error);
      verify(storeMock.dispatch(anything())).called();
      const [arg] = capture(storeMock.dispatch).last();
      expect((arg as Action).type).toBe(dataSlice.expectedType);

    });
  });
});
