import { createReducer, on } from '@ngrx/store';

import { Authorization } from 'ish-core/models/authorization/authorization.model';

import { loadRolesAndPermissionsSuccess } from './authorization.actions';

const initialState: Authorization = {
  roleDisplayNames: [],
  permissionIDs: [],
};

export const authorizationReducer = createReducer(
  initialState,
  on(loadRolesAndPermissionsSuccess, (_, action) => action.payload.authorization)
);
