import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';

import { getOrganizationManagementState } from '../organization-management-store';

import { usersAdapter } from './users.reducer';

const getUsersState = createSelector(getOrganizationManagementState, state => state.users);

export const getUsersLoading = createSelector(getUsersState, state => state.loading);

export const getUsersError = createSelector(getUsersState, state => state.error);

const { selectAll, selectEntities, selectTotal } = usersAdapter.getSelectors(getUsersState);

export const getUsers = selectAll;

export const getUserCount = selectTotal;

export const getSelectedUser = createSelector(
  selectRouteParam('B2BCustomerLogin'),
  selectEntities,
  (login, users) => users[login]
);
