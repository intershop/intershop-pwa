import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { UserCostCenter } from 'ish-core/models/cost-center/cost-center.model';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { loadUserCostCenter, loadUserCostCenterFail, loadUserCostCenterSuccess } from './cost-center.actions';

export const costCenterAdapter = createEntityAdapter<UserCostCenter>();

export interface CostCenterState extends EntityState<UserCostCenter> {
  loading: boolean;
  error: HttpError;
}

const initialState: CostCenterState = costCenterAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const costCenterReducer = createReducer(
  initialState,
  setLoadingOn(loadUserCostCenter),
  setErrorOn(loadUserCostCenterFail),
  unsetLoadingAndErrorOn(loadUserCostCenterSuccess),
  on(loadUserCostCenterSuccess, (state, action) => costCenterAdapter.upsertMany(action.payload.userCostCenter, state))
);
