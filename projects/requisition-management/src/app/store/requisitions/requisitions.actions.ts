import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Requisition } from '../../models/requisition/requisition.model';

export const loadRequisitions = createAction('[Requisitions] Load Requisitions');

export const loadRequisitionsFail = createAction('[Requisitions API] Load Requisitions Fail', httpError());

export const loadRequisitionsSuccess = createAction(
  '[Requisitions API] Load Requisitions Success',
  payload<{ requisitions: Requisition[] }>()
);
