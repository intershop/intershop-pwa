import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { Requisition } from '../../models/requisition/requisition.model';

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

export const requisitionsAdapter = createEntityAdapter<Requisition>();

export interface RequisitionsState extends EntityState<Requisition> {
  loading: boolean;
  error: HttpError;
}

const initialState: RequisitionsState = requisitionsAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const requisitionsReducer = createReducer(
  initialState,
  setLoadingOn(loadRequisitions, loadRequisition, updateRequisitionStatus),
  unsetLoadingAndErrorOn(loadRequisitionsSuccess, loadRequisitionSuccess, updateRequisitionStatusSuccess),
  setErrorOn(loadRequisitionsFail, loadRequisitionFail, updateRequisitionStatusFail),
  on(loadRequisitionsSuccess, (state: RequisitionsState, action) =>
    requisitionsAdapter.upsertMany(action.payload.requisitions, {
      ...state,
    })
  ),
  on(loadRequisitionSuccess, updateRequisitionStatusSuccess, (state: RequisitionsState, action) =>
    requisitionsAdapter.upsertOne(action.payload.requisition, {
      ...state,
    })
  )
);
