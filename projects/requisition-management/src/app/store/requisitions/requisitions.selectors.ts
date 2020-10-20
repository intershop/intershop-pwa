import { createSelector } from '@ngrx/store';

import { getRequisitionManagementState } from '../requisition-management-store';

import { requisitionsAdapter } from './requisitions.reducer';

const getRequisitionsState = createSelector(getRequisitionManagementState, state => state.requisitions);

export const getRequisitionsLoading = createSelector(getRequisitionsState, state => state.loading);

export const getRequisitionsError = createSelector(getRequisitionsState, state => state.error);

export const { selectAll: getRequisitions } = requisitionsAdapter.getSelectors(getRequisitionsState);

const { selectEntities } = requisitionsAdapter.getSelectors(getRequisitionsState);

export const getRequisition = (id: string) => createSelector(selectEntities, entities => entities[id]);
