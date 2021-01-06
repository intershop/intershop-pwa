import { createReducer, on } from '@ngrx/store';

import { Authorization } from 'ish-core/models/authorization/authorization.model';

import { loadRolesAndPermissionsSuccess } from './authorization.actions';

const initialState: Authorization = {
  roles: [],
  // has to be undefined so the service can wait for retrieval
  permissionIDs: undefined,
};

export const authorizationReducer = createReducer(
  initialState,
  on(loadRolesAndPermissionsSuccess, (_, action) => action.payload.authorization)
);
