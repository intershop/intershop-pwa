import { createFeatureSelector } from '@ngrx/store';

export interface OrganizationHierarchiesState {
  organizationHierarchies: OrganizationHierarchiesState;
}

export const getOrganizationHierarchiesState = createFeatureSelector<OrganizationHierarchiesState>(
  'organizationHierarchies'
);
