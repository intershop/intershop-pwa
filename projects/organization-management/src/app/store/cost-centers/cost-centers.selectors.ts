import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';

import { getOrganizationManagementState } from '../organization-management-store';

import { costCentersAdapter } from './cost-centers.reducer';

const getCostCentersState = createSelector(getOrganizationManagementState, state => state.costCenters);

export const getCostCentersLoading = createSelector(getCostCentersState, state => state.loading);

export const getCostCentersError = createSelector(getCostCentersState, state => state.error);

const { selectAll, selectEntities } = costCentersAdapter.getSelectors(getCostCentersState);

export const getCostCenters = selectAll;

export const getSelectedCostCenter = createSelector(
  selectRouteParam('CostCenterId'),
  selectEntities,
  (id, costCenters) => costCenters[id]
);
