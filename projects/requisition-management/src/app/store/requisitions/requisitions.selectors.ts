import { createSelector } from '@ngrx/store';

import { getLoggedInUser } from 'ish-core/store/customer/user';
import { RequisitionStatus, RequisitionViewer } from '../../models/requisition/requisition.model';

import { getRequisitionManagementState } from '../requisition-management-store';

import { requisitionsAdapter } from './requisitions.reducer';

const getRequisitionsState = createSelector(getRequisitionManagementState, state => state.requisitions);

export const getRequisitionsLoading = createSelector(getRequisitionsState, state => state.loading);

export const getRequisitionsError = createSelector(getRequisitionsState, state => state.error);

const { selectAll, selectEntities } = requisitionsAdapter.getSelectors(getRequisitionsState);

export const getRequisitions = (view: RequisitionViewer, status: RequisitionStatus) =>
  createSelector(selectAll, getLoggedInUser, (requisitions, user) =>
    requisitions.filter(req => {
      // TODO: issue with keeping in sync with requisition changes on server (e.g. remove pending from state if no longer returned by pending call)
      if (view === 'buyer') {
        return req.user.email === user.email && req.approval.statusCode === status;
      } else {
        // TODO: no customerApprovers at approved requisitions (leads to error)
        // TODO: costCenterApprovers
        // TODO: already approved by current user
        return (
          req.approval.customerApprovers?.map(a => a.email).includes(user.email) && req.approval.statusCode === status
        );
      }
    })
  );

export const getRequisition = (id: string) => createSelector(selectEntities, entities => entities[id]);
