import { createFeatureSelector } from '@ngrx/store';

import { BuyingContextState } from './buying-context/buying-context.reducer';
import { OrganizationHierarchiesGroupState } from './organization-hierarchies-group/organization-hierarchies-group.reducer';

export interface OrganizationHierarchiesState {
  group: OrganizationHierarchiesGroupState;
  buyingContext: BuyingContextState;
}

export const getOrganizationHierarchiesState =
  createFeatureSelector<OrganizationHierarchiesState>('organizationHierarchies');
