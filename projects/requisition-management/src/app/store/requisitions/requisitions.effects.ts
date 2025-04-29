import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap } from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { displayErrorMessage, displayInfoMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { RequisitionsService } from '../../services/requisitions/requisitions.service';

import {
  loadRequisition,
  loadRequisitionFail,
  loadRequisitionSuccess,
  loadRequisitions,
  loadRequisitionsFail,
  loadRequisitionsSuccess,
  updateRequisitionStatus,
  updateRequisitionStatusFail,
  updateRequisitionStatusFromApprovalList,
  updateRequisitionStatusSuccess,
} from './requisitions.actions';

@Injectable()
export class RequisitionsEffects {
  constructor(private actions$: Actions, private requisitionsService: RequisitionsService, private router: Router) {}

  loadRequisitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisitions),
      mapToPayload(),
      concatMap(({ view, status }) =>
        this.requisitionsService.getRequisitions(view, status).pipe(
          map(requisitions => loadRequisitionsSuccess({ requisitions, view, status })),
          mapErrorToAction(loadRequisitionsFail)
        )
      )
    )
  );

  loadRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisition),
      mapToPayload(),
      switchMap(({ requisitionId }) =>
        this.requisitionsService.getRequisition(requisitionId).pipe(
          map(requisition => loadRequisitionSuccess({ requisition })),
          mapErrorToAction(loadRequisitionFail)
        )
      )
    )
  );

  /**
   * After selecting and successfully loading a requisition, triggers a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  loadProductsForSelectedRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisitionSuccess),
      mapToPayloadProperty('requisition'),
      switchMap(requisition => [
        ...requisition.lineItems.map(({ productSKU }) =>
          loadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
        ),
      ])
    )
  );

  updateRequisitionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequisitionStatus),
      mapToPayload(),
      concatMap(payload =>
        this.requisitionsService
          .updateRequisitionStatus(payload.requisitionId, payload.status, payload.approvalComment)
          .pipe(
            concatMap(requisition =>
              from(this.router.navigate([`/account/requisitions/approver`])).pipe(
                concatMap(() => {
                  let messageAction;
                  // keep-localization-pattern: ^approval\.order_.*\.text$
                  switch (requisition.approval?.statusCode) {
                    case 'APPROVED':
                    case 'REJECTED':
                      messageAction = displaySuccessMessage({
                        message: `approval.order_${requisition.approval.statusCode.toLowerCase()}.text`,
                      });
                      break;
                    case 'PENDING':
                      messageAction = displayInfoMessage({
                        message: `approval.order_partially_approved.text`,
                      });
                  }

                  return [updateRequisitionStatusSuccess({ requisition }), messageAction];
                })
              )
            ),
            mapErrorToAction(updateRequisitionStatusFail)
          )
      )
    )
  );

  updateRequisitionStatusFromApprovalList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequisitionStatusFromApprovalList),
      mapToPayload(),
      concatMap(({ requisitionId, status, approvalComment }) =>
        this.requisitionsService.updateRequisitionStatus(requisitionId, status, approvalComment).pipe(
          mergeMap(requisition => {
            const baseActions: Action[] = [
              updateRequisitionStatusSuccess({ requisition }),
              loadRequisitions({ view: 'approver', status: 'PENDING' }),
              displaySuccessMessage({
                message: `approval.order_${requisition.approval.statusCode.toLowerCase()}.text`,
              }),
            ];
            const infoActions =
              requisition.approval.statusCode === 'PENDING'
                ? [displayInfoMessage({ message: 'approval.order_partially_approved.text' })]
                : [];

            if (infoActions.length > 0) {
              return infoActions;
            }
            return baseActions;
          }),
          catchError(error =>
            of(
              updateRequisitionStatusFail({ error }),
              displayErrorMessage({ message: error.errors?.[0]?.message ?? error.message })
            )
          )
        )
      )
    )
  );

  /**
   * In case the requisition (status) update failed because the requisition is invalid
   * and rejected by system the user is navigated to the requisition overview page
   */
  redirectAfterUpdateRequisitionStatusFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateRequisitionStatusFail),
        mapToPayloadProperty('error'),
        concatMap(error =>
          error.status === 422 ? this.router.navigate([`/account/requisitions/approver`]) : undefined
        )
      ),
    { dispatch: false }
  );
}
