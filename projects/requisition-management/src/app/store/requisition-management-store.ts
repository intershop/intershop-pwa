import { createFeatureSelector } from '@ngrx/store';

import { RequisitionsState } from './requisitions/requisitions.reducer';

export interface RequisitionManagementState {
  requisitions: RequisitionsState;
}

export const getRequisitionManagementState = createFeatureSelector<RequisitionManagementState>('requisitionManagement');
