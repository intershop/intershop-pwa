import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { loadCostCenter, loadCostCenterFail, loadCostCenterSuccess } from './cost-center.actions';

export const costCenterAdapter = createEntityAdapter<CostCenter[]>();

export interface CostCenterState extends EntityState<CostCenter[]> {
  loading: boolean;
  error: HttpError;
  costCenters: CostCenter[];
}

const initialState: CostCenterState = costCenterAdapter.getInitialState({
  loading: false,
  error: undefined,
  costCenters: [],
});

export const costCenterReducer = createReducer(
  initialState,
  setLoadingOn(loadCostCenter),
  setErrorOn(loadCostCenterFail),
  unsetLoadingAndErrorOn(loadCostCenterSuccess),
  on(loadCostCenterSuccess, (state, action) => costCenterAdapter.addOne(action.payload.costCenter, state))
);
