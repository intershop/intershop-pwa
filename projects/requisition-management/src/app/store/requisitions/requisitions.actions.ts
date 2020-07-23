import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Requisition } from '../../models/requisition/requisition.model';

export const loadRequisitions = createAction(
  '[Requisitions] Load Requisitions',
  payload<{ view?: string; status?: string }>()
);

export const loadRequisitionsFail = createAction('[Requisitions API] Load Requisitions Fail', httpError());

export const loadRequisitionsSuccess = createAction(
  '[Requisitions API] Load Requisitions Success',
  payload<{ requisitions: Requisition[] }>()
);

export const loadRequisition = createAction('[Requisitions] Load Requisition', payload<{ requisitionId: string }>());

export const loadRequisitionFail = createAction('[Requisitions API] Load Requisition Fail', httpError());

export const loadRequisitionSuccess = createAction(
  '[Requisitions API] Load Requisition Success',
  payload<{ requisition: Requisition }>()
);
