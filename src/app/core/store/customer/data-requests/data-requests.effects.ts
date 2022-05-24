import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { concatMap, filter, map } from 'rxjs/operators';

import { DataRequestsService } from 'ish-core/services/data-requests/data-requests.service';
import { mapToRouterState } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import {
  confirmGDPRDataRequest,
  confirmGDPRDataRequestFail,
  confirmGDPRDataRequestSuccess,
} from './data-requests.actions';

@Injectable()
export class DataRequestsEffects {
  constructor(private actions$: Actions, private dataRequestsService: DataRequestsService) {}

  confirmGDPRDataRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmGDPRDataRequest),
      mapToPayload(),
      concatMap(payload =>
        this.dataRequestsService
          .confirmGDPRDataRequest(payload.data)
          .pipe(map(confirmGDPRDataRequestSuccess), mapErrorToAction(confirmGDPRDataRequestFail))
      )
    )
  );

  /**
   * Listener for GDPR email routing. If route is called the action {@link confirmGDPRDataRequest} is dispatched.
   */
  routeListenerForDataRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      mapToRouterState(),
      filter(routerState => /^\/(gdpr-requests*)/.test(routerState.url)),
      map(({ queryParams }) =>
        confirmGDPRDataRequest({ data: { hash: queryParams.Hash, requestID: queryParams.PersonalDataRequestID } })
      )
    )
  );
}
