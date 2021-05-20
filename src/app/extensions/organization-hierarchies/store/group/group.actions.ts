import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

export const loadGroups = createAction('[Organizational Groups API] Load Groups');

export const loadGroupsFail = createAction('[Organizational Groups API] Load Groups Fail', httpError());

export const loadGroupsSuccess = createAction(
  '[Organizational Groups API] Load Groups Success',
  payload<{ groups: OrganizationGroup[] }>()
);

export const assignGroup = createAction('[Organizational Groups API] Assign Group', payload<{ id: string }>());
