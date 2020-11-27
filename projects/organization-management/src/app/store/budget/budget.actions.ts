import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { UserBudget } from '../../models/user-budget/user-budget.model';

export const loadBudget = createAction('[Budget Internal] Load Budget');

export const loadBudgetSuccess = createAction('[Budget API] Load Budget Success', payload<{ budget: UserBudget }>());

export const loadBudgetFail = createAction('[Budget API] Load Budget Fail', httpError());
