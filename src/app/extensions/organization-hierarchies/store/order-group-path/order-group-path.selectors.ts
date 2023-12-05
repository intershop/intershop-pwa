import { createSelector } from '@ngrx/store';

import { getOrganizationHierarchiesState } from '../organization-hierarchies-store';

import { pathAdapter } from './order-group-path.reducer';

const getOrderGroupPathState = createSelector(getOrganizationHierarchiesState, state => state.orderGroupPath);

const { selectEntities } = pathAdapter.getSelectors(getOrderGroupPathState);

export const getOrderGroupPathDetails = (id: string) => createSelector(selectEntities, entities => id && entities[id]);

export const getOrderGroupPathLoading = createSelector(getOrderGroupPathState, state => state.loading);

export const getOrderGroupPathError = createSelector(getOrderGroupPathState, state => state.error);
