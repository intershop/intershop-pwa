import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  addCostCenter,
  addCostCenterBuyers,
  addCostCenterBuyersFail,
  addCostCenterBuyersSuccess,
  addCostCenterFail,
  addCostCenterSuccess,
  deleteCostCenter,
  deleteCostCenterBuyer,
  deleteCostCenterBuyerFail,
  deleteCostCenterBuyerSuccess,
  deleteCostCenterFail,
  deleteCostCenterSuccess,
  loadCostCenter,
  loadCostCenterFail,
  loadCostCenterSuccess,
  loadCostCenters,
  loadCostCentersFail,
  loadCostCentersSuccess,
  updateCostCenter,
  updateCostCenterBuyer,
  updateCostCenterBuyerFail,
  updateCostCenterBuyerSuccess,
  updateCostCenterFail,
  updateCostCenterSuccess,
} from './cost-centers.actions';

function sortByCostCenterId(a: CostCenter, b: CostCenter): number {
  return a.costCenterId.localeCompare(b.costCenterId);
}

export const costCentersAdapter = createEntityAdapter<CostCenter>({
  sortComparer: sortByCostCenterId,
});

export interface CostCentersState extends EntityState<CostCenter> {
  loading: boolean;
  error: HttpError;
}

const initialState: CostCentersState = costCentersAdapter.getInitialState({
  loading: false,
  error: undefined,
});

export const costCentersReducer = createReducer(
  initialState,
  setLoadingOn(
    loadCostCenters,
    loadCostCenter,
    addCostCenter,
    updateCostCenter,
    deleteCostCenter,
    addCostCenterBuyers,
    updateCostCenterBuyer,
    deleteCostCenterBuyer
  ),
  unsetLoadingAndErrorOn(
    loadCostCentersSuccess,
    loadCostCenterSuccess,
    addCostCenterSuccess,
    updateCostCenterSuccess,
    deleteCostCenterSuccess,
    addCostCenterBuyersSuccess,
    updateCostCenterBuyerSuccess,
    deleteCostCenterBuyerSuccess
  ),
  setErrorOn(
    loadCostCentersFail,
    loadCostCenterFail,
    addCostCenterFail,
    updateCostCenterFail,
    deleteCostCenterFail,
    addCostCenterBuyersFail,
    updateCostCenterBuyerFail,
    deleteCostCenterBuyerFail
  ),
  on(loadCostCentersSuccess, (state, action) => {
    const { costCenters } = action.payload;

    return {
      ...costCentersAdapter.upsertMany(costCenters, state),
    };
  }),
  on(loadCostCenterSuccess, (state, action) => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  }),
  on(addCostCenterSuccess, (state, action) => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.addOne(costCenter, state),
    };
  }),
  on(updateCostCenterSuccess, (state, action) => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  }),
  on(deleteCostCenterSuccess, (state, action) => {
    const { id } = action.payload;

    return {
      ...costCentersAdapter.removeOne(id, state),
    };
  }),
  on(addCostCenterBuyersSuccess, (state, action) => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  }),
  on(updateCostCenterBuyerSuccess, (state, action) => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  }),
  on(deleteCostCenterBuyerSuccess, (state, action) => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  })
);
