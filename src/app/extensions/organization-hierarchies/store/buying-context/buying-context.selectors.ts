import { createSelector } from '@ngrx/store';

import { getOrganizationHierarchiesState } from '../organization-hierarchies-store';

export const getBuyingContext = createSelector(getOrganizationHierarchiesState, state => state.buyingContext);
