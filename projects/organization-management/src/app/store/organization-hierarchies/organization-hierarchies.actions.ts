import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Node, NodeTree } from '../../models/node/node.model';

export const loadGroups = createAction('[Organization Hierarchies API] Load Groups');

export const loadGroupsFail = createAction('[Organization Hierarchies API] Load Groups Fail', httpError());

export const loadGroupsSuccess = createAction(
  '[Organization Hierarchies API] Load Groups Success',
  payload<{ nodeTree: NodeTree }>()
);

export const createGroup = createAction(
  '[Organization Hierarchies API] Create Group',
  payload<{ parent: Node; child: Node }>()
);

export const createGroupSuccess = createAction(
  '[Organization Hierarchies API] Create Group Success',
  payload<{ nodeTree: NodeTree }>()
);

export const createGroupFail = createAction('[Organization Hierarchies API] Create Group Fail', httpError());
