import { createFeatureSelector } from '@ngrx/store';

export interface CompanyStructureState {}

export const getCompanyStructureState = createFeatureSelector<CompanyStructureState>('companyStructure');
