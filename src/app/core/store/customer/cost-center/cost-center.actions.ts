import { createAction } from '@ngrx/store';
import { UserCostCenter } from 'ish-core/models/cost-center/cost-center.model';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadUserCostCenter = createAction('[CostCenter] Load User Cost Center');

export const loadUserCostCenterFail = createAction('[CostCenter API] Load User Cost Center Fail', httpError());

export const loadUserCostCenterSuccess = createAction(
  '[CostCenter API] Load User Cost Center Success',
  payload<{ userCostCenter: UserCostCenter }>()
);
