import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { concatMap, map, mapTo, switchMap } from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
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
              /* ToDo: use only relative routes */
              from(
                this.router.navigate([
                  `/account/requisitions/approver/${requisition.id}`,
                  { status: requisition.approval?.statusCode },
                ])
              ).pipe(mapTo(updateRequisitionStatusSuccess({ requisition })))
            ),
            mapErrorToAction(updateRequisitionStatusFail)
          )
      )
    )
  );
}
