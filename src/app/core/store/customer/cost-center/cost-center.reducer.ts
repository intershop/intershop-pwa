import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { loadCostCenter, loadCostCenterFail, loadCostCenterSuccess } from './cost-center.actions';

export const costCenterAdapter = createEntityAdapter<User>();

export interface CostCenterState extends EntityState<User> {
  loading: boolean;
  error: HttpError;
}

const initialState: CostCenterState = costCenterAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const costCenterReducer = createReducer(
  initialState,
  setLoadingOn(loadCostCenter),
  setErrorOn(loadCostCenterFail),
  unsetLoadingAndErrorOn(loadCostCenterSuccess),
  on(loadCostCenterSuccess, (state, action) => costCenterAdapter.upsertMany(action.payload.costCenter, state))
);
