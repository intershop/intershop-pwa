import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';

import { costCenterAdapter } from './cost-center.reducer';

const getCostCenterState = createSelector(getCustomerState, state => state.costCenter);

export const getCostCenter = createSelector(getCustomerState, state => state.user.costCenter);

export const getCostCenterLoading = createSelector(getCostCenterState, state => state.loading);

export const getCostCenterError = createSelector(getCostCenterState, state => state.error);

export const { selectEntities: getCostCenterEntities, selectTotal: getNumberOfCostCenter } =
  costCenterAdapter.getSelectors(getCostCenterState);
