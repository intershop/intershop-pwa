import { HttpHeaders } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import * as using from 'jasmine-data-provider';
import { cold } from 'jest-marbles';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { ErrorActionTypes } from '../../store/error';

import { ApiServiceErrorHandler } from './api.service.errorhandler';

describe('Api Service Errorhandler', () => {
  let apiServiceErrorHandler: ApiServiceErrorHandler;

  let storeMock$: Store<{}>;

  beforeEach(async(() => {
    storeMock$ = mock(Store);
    TestBed.configureTestingModule({
      declarations: [],
      providers: [{ provide: Store, useFactory: () => instance(storeMock$) }, ApiServiceErrorHandler],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    apiServiceErrorHandler = TestBed.get(ApiServiceErrorHandler);
  }));

  function dataProviderKnown() {
    return [
      { error: { status: 0 }, expectedType: ErrorActionTypes.TimeoutError },
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

      verify(storeMock$.dispatch(anything())).never();
      expect(result$).toBeObservable(cold('#', undefined, dataSlice.error));
    });
  });

  using(dataProviderKnown, dataSlice => {
    it(`should create  state \' ${dataSlice.expectedType} \')  when Http Code ${
      dataSlice.error.status
    } is handled`, () => {
      const header = new HttpHeaders();
      dataSlice.error.headers = header;
      apiServiceErrorHandler.dispatchCommunicationErrors(dataSlice.error);

      verify(storeMock$.dispatch(anything())).called();
      const [arg] = capture(storeMock$.dispatch).last();
      expect((arg as Action).type).toBe(dataSlice.expectedType);
    });
  });
});
