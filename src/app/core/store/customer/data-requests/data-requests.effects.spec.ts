import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { DataRequest, DataRequestConfirmation } from 'ish-core/models/data-request/data-request.model';
import { DataRequestsService } from 'ish-core/services/data-requests/data-requests.service';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { routerTestNavigatedAction } from 'ish-core/utils/dev/routing';

import {
  confirmGDPRDataRequest,
  confirmGDPRDataRequestFail,
  confirmGDPRDataRequestSuccess,
} from './data-requests.actions';
import { DataRequestsEffects } from './data-requests.effects';

describe('Data Requests Effects', () => {
  let actions$: Observable<Action>;
  let effects: DataRequestsEffects;
  let dataRequestsServiceMock: DataRequestsService;
  let router: Router;

  const requestID = '0123456789';
  const hash = 'test_hash';

  const dataRequest = { requestID, hash } as DataRequest;
  const dataRequestConfirmation = { infoCode: 'gdpr_request.confirmed.info' } as DataRequestConfirmation;

  beforeEach(() => {
    dataRequestsServiceMock = mock(DataRequestsService);
    when(dataRequestsServiceMock.confirmGDPRDataRequest(anything())).thenReturn(of(dataRequestConfirmation));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: '**', children: [] }])],
      providers: [
        { provide: DataRequestsService, useFactory: () => instance(dataRequestsServiceMock) },
        DataRequestsEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(DataRequestsEffects);
    router = TestBed.inject(Router);
  });

  describe('confirmGDPRDataRequest$', () => {
    it('should call the DataRequestsServic for confirmGDPRDataRequest', done => {
      const action = confirmGDPRDataRequest({ data: dataRequest });
      actions$ = of(action);

      effects.confirmGDPRDataRequest$.subscribe(() => {
        verify(dataRequestsServiceMock.confirmGDPRDataRequest(anything())).once();
        done();
      });
    });
    it('should map to action of type confirmGDPRDataRequestSuccess', () => {
      const action = confirmGDPRDataRequest({ data: dataRequest });
      const completion = confirmGDPRDataRequestSuccess(dataRequestConfirmation);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.confirmGDPRDataRequest$).toBeObservable(expected$);
    });
    it('should map invalid request to action of type confirmGDPRDataRequestFail', () => {
      when(dataRequestsServiceMock.confirmGDPRDataRequest(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = confirmGDPRDataRequest({ data: dataRequest });
      const error = makeHttpError({ message: 'invalid' });
      const completion = confirmGDPRDataRequestFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.confirmGDPRDataRequest$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForDataRequests', () => {
    it('should fire confirmGDPRDataRequest when route gdpr-requests is navigated', () => {
      router.navigateByUrl('/gdpr-requests');

      const action = routerTestNavigatedAction({
        routerState: { url: '/gdpr-requests', queryParams: { Hash: hash, PersonalDataRequestID: requestID } },
      });
      actions$ = of(action);

      const completion = confirmGDPRDataRequest({ data: dataRequest });
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(c)', { c: completion });

      expect(effects.routeListenerForDataRequests$).toBeObservable(expected$);
    });
  });
});
