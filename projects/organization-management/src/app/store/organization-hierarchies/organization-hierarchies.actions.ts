import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Group, GroupTree } from '../../models/group/group.model';

export const loadGroups = createAction('[Organization Hierarchies API] Load Groups');

export const loadGroupsFail = createAction('[Organization Hierarchies API] Load Groups Fail', httpError());

export const loadGroupsSuccess = createAction(
  '[Organization Hierarchies API] Load Groups Success',
  payload<{ groupTree: GroupTree }>()
);

export const createGroup = createAction(
  '[Organization Hierarchies API] Create Group',
  payload<{ parent: Group; child: Group }>()
);

export const createGroupSuccess = createAction(
  '[Organization Hierarchies API] Create Group Success',
  payload<{ groupTree: GroupTree; group: Group }>()
);

export const createGroupFail = createAction('[Organization Hierarchies API] Create Group Fail', httpError());
