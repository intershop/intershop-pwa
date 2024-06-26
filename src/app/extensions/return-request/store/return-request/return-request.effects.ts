import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, iif, map, switchMap } from 'rxjs';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { ReturnRequestService } from '../../services/return-request/return-request.service';

import {
  createReturnRequest,
  createReturnRequestFail,
  loadOrderByDocumentNoAndEmail,
  loadOrderByDocumentNoAndEmailFail,
  loadOrderByDocumentNoAndEmailSuccess,
  loadOrderReturnReasons,
  loadOrderReturnReasonsFail,
  loadOrderReturnReasonsSuccess,
  loadOrderReturnRequests,
  loadOrderReturnRequestsFail,
  loadOrderReturnRequestsSuccess,
  loadOrderReturnableItems,
  loadOrderReturnableItemsFail,
  loadOrderReturnableItemsSuccess,
} from './return-request.actions';

@Injectable()
export class ReturnRequestEffects {
  constructor(private actions$: Actions, private returnRequestService: ReturnRequestService) {}

  loadOrderReturnReasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderReturnReasons),
      switchMap(() =>
        this.returnRequestService.getOrderReturnReasons().pipe(
          map(reasons => loadOrderReturnReasonsSuccess({ reasons })),
          mapErrorToAction(loadOrderReturnReasonsFail)
        )
      )
    )
  );

  loadOrderReturnableItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderReturnableItems),
      mapToPayload(),
      switchMap(payload =>
        iif(
          () => payload.isGuest,
          this.returnRequestService.getOrderReturnableItemsByDocumentNoAndEmail(payload.documentNo, payload.email),
          this.returnRequestService.getOrderReturnableItems(payload.orderId)
        ).pipe(
          map(orderReturnableItems => loadOrderReturnableItemsSuccess({ orderReturnableItems })),
          mapErrorToAction(loadOrderReturnableItemsFail)
        )
      )
    )
  );

  getOrderReturnRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderReturnRequests),
      mapToPayload(),
      concatMap(({ orderIds }) =>
        this.returnRequestService.getOrderReturnRequests(orderIds).pipe(
          map(orderReturnRequests => loadOrderReturnRequestsSuccess({ orderReturnRequests })),
          mapErrorToAction(loadOrderReturnRequestsFail)
        )
      )
    )
  );

  createReturnRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReturnRequest),
      mapToPayload(),
      concatMap(({ request }) =>
        iif(
          () => request.isGuest,
          this.returnRequestService.createReturnRequestByDocumentNoAndEmail(request),
          this.returnRequestService.createReturnRequest(request)
        ).pipe(
          map(() => displaySuccessMessage({ message: 'toolineo.account.return_request.modal.submit_success' })),
          mapErrorToAction(createReturnRequestFail)
        )
      )
    )
  );

  displayCreateReturnRequestErrorMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReturnRequestFail),
      mapToPayloadProperty('error'),
      map(error =>
        displayErrorMessage({
          message: error.message,
        })
      )
    )
  );

  loadOrderByDocumentNoAndEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderByDocumentNoAndEmail),
      mapToPayload(),
      switchMap(({ documentNo, email }) =>
        this.returnRequestService.getOrderByDocumentNoAndEmail(documentNo, email).pipe(
          map(order => loadOrderByDocumentNoAndEmailSuccess({ order })),
          mapErrorToAction(loadOrderByDocumentNoAndEmailFail)
        )
      )
    )
  );
}
