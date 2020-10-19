import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { UserBudgets } from '../../models/user-budgets/user-budgets.model';

export const loadBudget = createAction('[Budget Internal] Load Budget');

export const loadBudgetSuccess = createAction('[Budget API] Load Budget Success', payload<{ budget: UserBudgets }>());

export const loadBudgetFail = createAction('[Budget API] Load Budget Fail', httpError());
