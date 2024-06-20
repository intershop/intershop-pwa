import { createAction } from '@ngrx/store';

import { UserBudget } from 'ish-core/models/user-budget/user-budget.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadBudget = createAction('[Budget] Load Budget');

export const loadBudgetSuccess = createAction('[Budget API] Load Budget Success', payload<{ budget: UserBudget }>());

export const loadBudgetFail = createAction('[Budget API] Load Budget Fail', httpError());
