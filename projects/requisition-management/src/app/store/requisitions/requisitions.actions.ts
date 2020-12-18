import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Requisition, RequisitionStatus, RequisitionViewer } from '../../models/requisition/requisition.model';

export const loadRequisitions = createAction(
  '[Requisitions] Load Requisitions',
  payload<{ view?: RequisitionViewer; status?: RequisitionStatus }>()
);

export const loadRequisitionsFail = createAction('[Requisitions API] Load Requisitions Fail', httpError());

export const loadRequisitionsSuccess = createAction(
  '[Requisitions API] Load Requisitions Success',
  payload<{ requisitions: Requisition[]; view?: RequisitionViewer; status?: RequisitionStatus }>()
);

export const loadRequisition = createAction('[Requisitions] Load Requisition', payload<{ requisitionId: string }>());

export const loadRequisitionFail = createAction('[Requisitions API] Load Requisition Fail', httpError());

export const loadRequisitionSuccess = createAction(
  '[Requisitions API] Load Requisition Success',
  payload<{ requisition: Requisition }>()
);

export const updateRequisitionStatus = createAction(
  '[Requisitions] Update Requisition Status',
  payload<{ requisitionId: string; status: RequisitionStatus; approvalComment?: string }>()
);

export const updateRequisitionStatusFail = createAction(
  '[Requisitions API] Update Requisition Status Fail',
  httpError()
);

export const updateRequisitionStatusSuccess = createAction(
  '[Requisitions API] Update Requisition Status Success',
  payload<{ requisition: Requisition }>()
);
