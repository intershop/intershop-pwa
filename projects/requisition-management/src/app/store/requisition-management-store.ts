import { createFeatureSelector } from '@ngrx/store';

// tslint:disable-next-line: no-empty-interface
export interface RequisitionManagementState {}

export const getRequisitionManagementState = createFeatureSelector<RequisitionManagementState>('requisitionManagement');
