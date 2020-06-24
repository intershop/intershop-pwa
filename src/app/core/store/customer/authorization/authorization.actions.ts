import { createAction } from '@ngrx/store';

import { Authorization } from 'ish-core/models/authorization/authorization.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadRolesAndPermissionsSuccess = createAction(
  '[Authorization API] Load Roles and Permissions Success',
  payload<{ authorization: Authorization }>()
);

export const loadRolesAndPermissionsFail = createAction(
  '[Authorization API] Load Roles and Permissions Fail',
  httpError()
);
