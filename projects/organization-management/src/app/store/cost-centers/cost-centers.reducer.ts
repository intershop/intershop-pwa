import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { CostCenter, CostCenterBase } from 'ish-core/models/cost-center/cost-center.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PagingInfo } from 'ish-core/models/paging-info/paging-info.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  addCostCenter,
  addCostCenterBuyers,
  addCostCenterBuyersFail,
  addCostCenterBuyersSuccess,
  addCostCenterFail,
  addCostCenterFromCsvSingleResult,
  addCostCenterSuccess,
  addCostCentersFromCsv,
  addCostCentersFromCsvComplete,
  addCostCentersFromCsvImportTotal,
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
  paging: PagingInfo;
  importResults: { costCenter: CostCenterBase; status: string }[];
  importTotal: number;
}

const initialState: CostCentersState = costCentersAdapter.getInitialState({
  loading: false,
  error: undefined,
  paging: undefined,
  importResults: [],
  importTotal: 0,
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
  on(loadCostCentersSuccess, (state, action): CostCentersState => {
    const { costCenters, paging } = action.payload;

    const updatedCostCenters = costCenters.map((costCenter, index) => ({
      ...costCenter,
      paginationPosition: (paging.offset ? paging.offset : 0) + index,
    }));

    return {
      ...(paging.offset
        ? costCentersAdapter.addMany(updatedCostCenters, state)
        : costCentersAdapter.setAll(updatedCostCenters, state)),
      paging,
    };
  }),
  on(loadCostCenterSuccess, (state, action): CostCentersState => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  }),
  on(addCostCenterSuccess, (state, action): CostCentersState => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.addOne(costCenter, state),
    };
  }),
  on(addCostCentersFromCsv, (state, action): CostCentersState => ({
    ...state,
    loading: true,
    importResults: [],
    importTotal: action.payload.costCenters?.length || 0,
  })),
  on(addCostCenterFromCsvSingleResult, (state, action): CostCentersState => ({
    ...state,
    importResults: [...state.importResults, action.payload.importResult],
  })),
  on(addCostCentersFromCsvComplete, (state): CostCentersState => ({
    ...state,
    loading: false,
  })),
  on(addCostCentersFromCsvImportTotal, (state, action): CostCentersState => ({
    ...state,
    importTotal: action.payload.totalCostCenters,
  })),
  on(updateCostCenterSuccess, (state, action): CostCentersState => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  }),
  on(deleteCostCenterSuccess, (state, action): CostCentersState => {
    const { id } = action.payload;

    return {
      ...costCentersAdapter.removeOne(id, state),
    };
  }),
  on(addCostCenterBuyersSuccess, (state, action): CostCentersState => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  }),
  on(updateCostCenterBuyerSuccess, (state, action): CostCentersState => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  }),
  on(deleteCostCenterBuyerSuccess, (state, action): CostCentersState => {
    const { costCenter } = action.payload;

    return {
      ...costCentersAdapter.upsertOne(costCenter, state),
    };
  })
);
