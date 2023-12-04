import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Group } from '../../models/group/group.model';

export const loadGroups = createAction('[Organization Hierarchies API] Load Groups');

export const loadGroupsFail = createAction('[Organization Hierarchies API] Load Groups Fail', httpError());

export const loadGroupsSuccess = createAction(
  '[Organization Hierarchies API] Load Groups Success',
  payload<{ groups: Group[] }>()
);

export const createGroup = createAction(
  '[Organization Hierarchies API] Create Group',
  payload<{ parentGroupId: string; child: Group }>()
);

export const createGroupSuccess = createAction(
  '[Organization Hierarchies API] Create Group Success',
  payload<{ group: Group }>()
);

export const createGroupFail = createAction('[Organization Hierarchies API] Create Group Fail', httpError());
