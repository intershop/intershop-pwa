import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { OrganizationHierarchiesGroup } from '../../models/organization-hierarchies-group/organization-hierarchies-group.model';

export const loadGroups = createAction('[Organizational Groups API] Load Groups');

export const loadGroupsFail = createAction('[Organizational Groups API] Load Groups Fail', httpError());

export const loadGroupsSuccess = createAction(
  '[Organizational Groups API] Load Groups Success',
  payload<{ groups: OrganizationHierarchiesGroup[] }>()
);

export const createGroup = createAction(
  '[Organizational Groups API] Create Group',
  payload<{ parentGroupId: string; child: OrganizationHierarchiesGroup }>()
);

export const createGroupFail = createAction('[Organizational Groups API] Create Group Fail', httpError());

export const deleteGroup = createAction('[Organizational Groups API] Delete Group', payload<{ groupId: string }>());

export const deleteGroupFail = createAction('[Organizational Groups API] Delete Group Fail', httpError());

export const assignGroup = createAction('[Organizational Groups API] Assign Group', payload<{ id: string }>());
