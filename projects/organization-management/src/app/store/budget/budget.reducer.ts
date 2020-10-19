import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { UserBudgets } from '../../models/user-budgets/user-budgets.model';

import { loadBudget, loadBudgetFail, loadBudgetSuccess } from './budget.actions';

export interface BudgetState {
  budget: UserBudgets;
  loading: boolean;
  error: HttpError;
}

const initialState: BudgetState = {
  loading: false,
  budget: undefined,
  error: undefined,
};

export const budgetReducer = createReducer(
  initialState,
  setLoadingOn(loadBudget),
  unsetLoadingAndErrorOn(loadBudgetSuccess),
  setErrorOn(loadBudgetFail),
  on(loadBudgetSuccess, (state: BudgetState, { payload: { budget } }) => ({
    ...state,
    budget,
  }))
);
