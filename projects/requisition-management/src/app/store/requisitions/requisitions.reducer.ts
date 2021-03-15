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
  filters: {
    buyerPENDING: string[];
    buyerAPPROVED: string[];
    buyerREJECTED: string[];
    approverPENDING: string[];
    approverAPPROVED: string[];
    approverREJECTED: string[];
  };
}

const initialState: RequisitionsState = requisitionsAdapter.getInitialState({
  loading: false,
  error: undefined,
  filters: {
    buyerPENDING: [],
    buyerAPPROVED: [],
    buyerREJECTED: [],
    approverPENDING: [],
    approverAPPROVED: [],
    approverREJECTED: [],
  },
});

export const requisitionsReducer = createReducer(
  initialState,
  setLoadingOn(loadRequisitions, loadRequisition, updateRequisitionStatus),
  unsetLoadingAndErrorOn(loadRequisitionsSuccess, loadRequisitionSuccess, updateRequisitionStatusSuccess),
  setErrorOn(loadRequisitionsFail, loadRequisitionFail, updateRequisitionStatusFail),
  on(loadRequisitionsSuccess, (state, action) =>
    requisitionsAdapter.upsertMany(action.payload.requisitions, {
      ...state,
      filters: {
        ...state.filters,
        [action.payload.view + action.payload.status]: action.payload.requisitions.map(requisition => requisition.id),
      },
    })
  ),
  on(loadRequisitionSuccess, updateRequisitionStatusSuccess, (state, action) =>
    requisitionsAdapter.upsertOne(action.payload.requisition, state)
  )
);
