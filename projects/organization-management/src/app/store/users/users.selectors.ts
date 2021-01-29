import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';

import { getOrganizationManagementState } from '../organization-management-store';

import { usersAdapter } from './users.reducer';

const getUsersState = createSelector(getOrganizationManagementState, state => state.users);

export const getUsersLoading = createSelector(getUsersState, state => state.loading);

export const getUsersError = createSelector(getUsersState, state => state.error);

const { selectAll, selectEntities, selectTotal } = usersAdapter.getSelectors(getUsersState);

export const getUsers = createSelector(selectAll, users =>
  users.filter(user => !user.roleIDs?.find(roleID => roleID === 'APP_B2B_OCI_USER'))
);

export const getUserCount = selectTotal;

export const getSelectedUser = createSelector(
  selectRouteParam('B2BCustomerLogin'),
  selectEntities,
  (login, users) => users[login]
);

export const getSystemUserRoles = createSelector(getUsersState, state => state.roles);

export const isSystemUserRolesLoaded = createSelector(getSystemUserRoles, roles => !!roles.length);

export const getRole = (roleID: string) =>
  createSelector(getSystemUserRoles, roles => roles?.find(r => r.id === roleID));

export const getRoles = (roleIDs: string[]) =>
  createSelector(getSystemUserRoles, roles =>
    // preserve order from state
    roles.filter(r => roleIDs?.includes(r.id))
  );
