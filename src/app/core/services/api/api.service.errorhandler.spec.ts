import { HttpHeaders } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jest-marbles';
import { noop, throwError } from 'rxjs';
import { anything, capture, spy, verify } from 'ts-mockito';

import { communicationTimeoutError, serverError } from 'ish-core/store/core/error';

import { ApiServiceErrorHandler } from './api.service.errorhandler';

describe('Api Service Errorhandler', () => {
  let apiServiceErrorHandler: ApiServiceErrorHandler;

  let store$: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore()],
    }).compileComponents();

    apiServiceErrorHandler = TestBed.inject(ApiServiceErrorHandler);
    store$ = spy(TestBed.inject(Store));
  });

  it.each([[{ status: 301, headers: undefined }], [{ status: 404, headers: undefined }]])(
    `should delegate Error when Http Code %j is handled`,
    error => {
      const header = new HttpHeaders();
      error.headers = header;
      const result$ = throwError(error).pipe(apiServiceErrorHandler.handleErrors(true));

      verify(store$.dispatch(anything())).never();
      expect(result$).toBeObservable(cold('#', undefined, error));
    }
  );

  it.each([
    [communicationTimeoutError.type, { status: 0, headers: undefined }],
    [serverError.type, { status: 500, headers: undefined }],
  ])(
    `should create state %s when Http Code %j is handled`,
    // tslint:disable-next-line: no-any
    fakeAsync((expectedType: string, error: any) => {
      const header = new HttpHeaders();
      error.headers = header;

      throwError(error).pipe(apiServiceErrorHandler.handleErrors(true)).subscribe(noop);

      tick(1000);

      verify(store$.dispatch(anything())).called();
      const [arg] = capture(store$.dispatch).last();
      expect((arg as Action).type).toBe(expectedType);
    })
  );
});
