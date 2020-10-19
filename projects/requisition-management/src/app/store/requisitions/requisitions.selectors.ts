import { createSelector } from '@ngrx/store';

import { getLoggedInUser } from 'ish-core/store/customer/user';

import { getRequisitionManagementState } from '../requisition-management-store';

import { requisitionsAdapter } from './requisitions.reducer';

const getRequisitionsState = createSelector(getRequisitionManagementState, state => state.requisitions);

export const getRequisitionsLoading = createSelector(getRequisitionsState, state => state.loading);

export const getRequisitionsError = createSelector(getRequisitionsState, state => state.error);

export const { selectAll: getRequisitions } = requisitionsAdapter.getSelectors(getRequisitionsState);

const { selectEntities } = requisitionsAdapter.getSelectors(getRequisitionsState);

export const getRequisition = (id: string) => createSelector(selectEntities, entities => entities[id]);

export const getBuyerPendingRequisitions = createSelector(getRequisitions, getLoggedInUser, (reqs, customer) =>
  reqs.filter(r => r.user.email === customer.email && r.approval.statusCode === 'PENDING')
);

export const getApproverPendingRequisitions = createSelector(getRequisitions, getLoggedInUser, (reqs, customer) =>
  reqs.filter(
    r => r.approval.customerApprovers.map(a => a.email).includes(customer.email) && r.approval.statusCode === 'PENDING'
  )
);
