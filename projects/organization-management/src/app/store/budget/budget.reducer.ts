import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { UserBudget } from '../../models/user-budget/user-budget.model';

import { loadBudget, loadBudgetFail, loadBudgetSuccess } from './budget.actions';

export interface BudgetState {
  budget: UserBudget;
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
  on(loadBudgetSuccess, (state, { payload: { budget } }) => ({
    ...state,
    budget,
  }))
);
