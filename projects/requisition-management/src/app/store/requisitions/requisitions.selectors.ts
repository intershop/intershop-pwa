import { createSelector } from '@ngrx/store';

import { RequisitionStatus, RequisitionViewer } from '../../models/requisition/requisition.model';
import { getRequisitionManagementState } from '../requisition-management-store';

import { requisitionsAdapter } from './requisitions.reducer';

const getRequisitionsState = createSelector(getRequisitionManagementState, state => state.requisitions);

export const getRequisitionsLoading = createSelector(getRequisitionsState, state => state.loading);

export const getRequisitionsError = createSelector(getRequisitionsState, state => state.error);

const getRequisitionsFilters = createSelector(getRequisitionsState, state => state.filters);

export const { selectEntities } = requisitionsAdapter.getSelectors(getRequisitionsState);

export const getRequisitions = (view: RequisitionViewer, status: RequisitionStatus) =>
  createSelector(selectEntities, getRequisitionsFilters, (requisitions, filters: { [k: string]: string[] }) =>
    filters[view + status].map(id => requisitions[id])
  );

export const getRequisition = (id: string) => createSelector(selectEntities, requisitions => requisitions[id]);
