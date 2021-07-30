import { createAction } from '@ngrx/store';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadCostCenter = createAction('[CostCenter] Load Cost Center');

export const loadCostCenterFail = createAction('[CostCenter API] Load Cost Center Fail', httpError());

export const loadCostCenterSuccess = createAction(
  '[CostCenter API] Load Cost Center Success',
  payload<{ costCenter: CostCenter }>()
);
