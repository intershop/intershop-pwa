import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';

const getAuthorizationState = createSelector(getCustomerState, state => state.authorization);

export const getUserRoles = createSelector(getAuthorizationState, state => state.roles);

export const getUserPermissions = createSelector(getAuthorizationState, state => state.permissionIDs);
