import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { Requisition } from '../../models/requisition/requisition.model';

import {
  loadRequisition,
  loadRequisitionFail,
  loadRequisitionSuccess,
  loadRequisitions,
  loadRequisitionsFail,
  loadRequisitionsSuccess,
} from './requisitions.actions';

export const requisitionsAdapter = createEntityAdapter<Requisition>();

export interface RequisitionsState extends EntityState<Requisition> {
  loading: boolean;
  error: HttpError;
  requisition: Requisition;
}

const initialState: RequisitionsState = requisitionsAdapter.getInitialState({
  loading: false,
  error: undefined,
  requisition: undefined,
});

export const requisitionsReducer = createReducer(
  initialState,
  setLoadingOn(loadRequisitions, loadRequisition),
  setErrorOn(loadRequisitionsFail, loadRequisitionFail),
  on(loadRequisitionsSuccess, (state: RequisitionsState, action) =>
    requisitionsAdapter.setAll(action.payload.requisitions, { ...state, loading: false, error: undefined })
  ),
  on(loadRequisitionSuccess, (state: RequisitionsState, action) => ({
    ...state,
    requisition: action.payload.requisition,
    loading: false,
    error: undefined,
  }))
);
