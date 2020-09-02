import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

export const loadGroup = createAction('[Group] Load Group');

export const loadGroupFail = createAction('[Group API] Load Group Fail', httpError());

export const loadGroupSuccess = createAction(
  '[Group API] Load Group Success',
  payload<{ group: OrganizationGroup[] }>()
);
