import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { Requisition } from '../../models/requisition/requisition.model';

import { loadRequisitions, loadRequisitionsFail, loadRequisitionsSuccess } from './requisitions.actions';

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
  setLoadingOn(loadRequisitions),
  setErrorOn(loadRequisitionsFail),
  on(loadRequisitionsSuccess, (state: RequisitionsState, action) =>
    requisitionsAdapter.setAll(action.payload.requisitions, { ...state, loading: false, error: undefined })
  )
);
