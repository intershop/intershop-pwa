import { createAction } from '@ngrx/store';

import { User } from 'ish-core/models/user/user.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadCostCenter = createAction('[CostCenter] Load CostCenter');

export const loadCostCenterFail = createAction('[CostCenter API] Load CostCenter Fail', httpError());

export const loadCostCenterSuccess = createAction(
  '[CostCenter API] Load CostCenter Success',
  payload<{ costCenter: User[] }>()
);
