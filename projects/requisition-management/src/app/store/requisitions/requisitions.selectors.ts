import { createSelector } from '@ngrx/store';

import { getCategoryTree } from 'ish-core/store/shopping/categories';
import { getProductEntities } from 'ish-core/store/shopping/products';

import { createRequisitionView } from '../../models/requisition/requisition.model';
import { getRequisitionManagementState } from '../requisition-management-store';

import { requisitionsAdapter } from './requisitions.reducer';

const getRequisitionsState = createSelector(getRequisitionManagementState, state => state.requisitions);

export const getRequisitionsLoading = createSelector(getRequisitionsState, state => state.loading);

export const getRequisitionsError = createSelector(getRequisitionsState, state => state.error);

export const {
  selectEntities: getRequisitionsEntities,
  selectAll: getRequisitions,
  selectTotal: getNumberOfRequisitions,
} = requisitionsAdapter.getSelectors(getRequisitionsState);

const getRequisitionInternal = createSelector(getRequisitionsState, state => state.requisition);

export const getRequisition = createSelector(
  getRequisitionInternal,
  getProductEntities,
  getCategoryTree,
  createRequisitionView
);
