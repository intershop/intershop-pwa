import { createAction } from '@ngrx/store';

import { CostCenter, CostCenterBase, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadCostCenters = createAction('[CostCenters] Load Cost Centers');

export const loadCostCentersFail = createAction('[CostCenters API] Load Cost Centers Fail', httpError());

export const loadCostCentersSuccess = createAction(
  '[CostCenters API] Load Cost Centers Success',
  payload<{ costCenters: CostCenter[] }>()
);

export const loadCostCenter = createAction('[CostCenters] Load Cost Center', payload<{ costCenterId: string }>());

export const loadCostCenterFail = createAction('[CostCenters API] Load Cost Center Fail', httpError());

export const loadCostCenterSuccess = createAction(
  '[CostCenters API] Load Cost Center Success',
  payload<{ costCenter: CostCenter }>()
);

export const addCostCenter = createAction('[CostCenters] Add Cost Center', payload<{ costCenter: CostCenterBase }>());

export const addCostCenterFail = createAction('[CostCenters API] Add Cost Center Fail', httpError());

export const addCostCenterSuccess = createAction(
  '[CostCenters API] Add Cost Center Success',
  payload<{ costCenter: CostCenter }>()
);

export const updateCostCenter = createAction(
  '[CostCenters] Update Cost Center',
  payload<{ costCenter: CostCenterBase }>()
);

export const updateCostCenterFail = createAction('[CostCenters API] Update Cost Center Fail', httpError());

export const updateCostCenterSuccess = createAction(
  '[CostCenters API] Update Cost Center Success',
  payload<{ costCenter: CostCenter }>()
);

export const deleteCostCenter = createAction('[CostCenters] Delete Cost Center', payload<{ id: string }>());

export const deleteCostCenterFail = createAction('[CostCenters API] Delete Cost Center Fail', httpError());

export const deleteCostCenterSuccess = createAction(
  '[CostCenters API] Delete Cost Center Success',
  payload<{ id: string }>()
);

export const addCostCenterBuyers = createAction(
  '[CostCenters] Add Cost Center Buyers',
  payload<{ costCenterId: string; buyers: CostCenterBuyer[] }>()
);

export const addCostCenterBuyersFail = createAction('[CostCenters API] Add Cost Center Buyers Fail', httpError());

export const addCostCenterBuyersSuccess = createAction(
  '[CostCenters API] Add Cost Center Buyers Success',
  payload<{ costCenter: CostCenter }>()
);

export const updateCostCenterBuyer = createAction(
  '[CostCenters] Update Cost Center Buyer',
  payload<{ costCenterId: string; buyer: CostCenterBuyer }>()
);

export const updateCostCenterBuyerFail = createAction('[CostCenters API] Update Cost Center Buyer Fail', httpError());

export const updateCostCenterBuyerSuccess = createAction(
  '[CostCenters API] Update Cost Center Buyer Success',
  payload<{ costCenter: CostCenter }>()
);

export const deleteCostCenterBuyer = createAction(
  '[CostCenters] Delete Cost Center Buyer',
  payload<{ costCenterId: string; login: string }>()
);

export const deleteCostCenterBuyerFail = createAction('[CostCenters API] Delete Cost Center Buyer Fail', httpError());

export const deleteCostCenterBuyerSuccess = createAction(
  '[CostCenters API] Delete Cost Center Buyer Success',
  payload<{ costCenter: CostCenter }>()
);
