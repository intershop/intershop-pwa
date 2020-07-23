import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { log } from 'ish-core/utils/dev/operators';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { RequisitionsService } from '../../services/requisitions/requisitions.service';

import {
  loadRequisition,
  loadRequisitionFail,
  loadRequisitionSuccess,
  loadRequisitions,
  loadRequisitionsFail,
  loadRequisitionsSuccess,
} from './requisitions.actions';

@Injectable()
export class RequisitionsEffects {
  constructor(private actions$: Actions, private requisitionsService: RequisitionsService) {}

  loadRequisitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisitions),
      mapToPayload(),
      log('loadRequisitionS Effekt'),
      switchMap(({ view, status }) =>
        this.requisitionsService.getRequisitions(view, status).pipe(
          map(requisitions => loadRequisitionsSuccess({ requisitions })),
          mapErrorToAction(loadRequisitionsFail)
        )
      )
    )
  );

  loadRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisition),
      mapToPayload(),
      log('loadRequisition Effekt'),
      switchMap(({ requisitionId }) =>
        this.requisitionsService.getRequisition(requisitionId).pipe(
          map(requisition => loadRequisitionSuccess({ requisition })),
          mapErrorToAction(loadRequisitionFail)
        )
      )
    )
  );
}
