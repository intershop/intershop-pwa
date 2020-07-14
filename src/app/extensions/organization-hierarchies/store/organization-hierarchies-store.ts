import { createFeatureSelector } from '@ngrx/store';

export interface OrganizationHierarchiesState {}

export const getOrganizationHierarchiesState = createFeatureSelector<OrganizationHierarchiesState>(
  'organizationHierarchies'
);
