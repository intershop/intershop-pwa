import { createFeatureSelector } from '@ngrx/store';

import { BuyingContextState } from './buying-context/buying-context.reducer';
import { GroupState } from './group/group.reducer';
import { OrderGroupPathState } from './order-group-path/order-group-path.reducer';

export interface OrganizationHierarchiesState {
  group: GroupState;
  buyingContext: BuyingContextState;
  orderGroupPath: OrderGroupPathState;
}

export const getOrganizationHierarchiesState =
  createFeatureSelector<OrganizationHierarchiesState>('organizationHierarchies');
