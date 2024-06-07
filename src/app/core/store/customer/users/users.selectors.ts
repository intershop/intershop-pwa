import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';

import { usersAdapter } from './users.reducer';

const getUsersState = createSelector(getCustomerState, state => state.users);

const { selectAll } = usersAdapter.getSelectors(getUsersState);

export const getUsers = createSelector(selectAll, users =>
  users.filter(user => !user.roleIDs?.find(roleID => ['APP_B2B_OCI_USER', 'APP_B2B_CXML_USER'].includes(roleID)))
);
