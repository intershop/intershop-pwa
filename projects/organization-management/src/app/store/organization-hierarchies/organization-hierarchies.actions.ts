import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { NodeTree } from '../../models/node/node.model';

export const loadGroups = createAction('[Organization Hierarchies API] Load Groups');

export const loadGroupsFail = createAction('[Organization Hierarchies API] Load Groups Fail', httpError());

export const loadGroupsSuccess = createAction(
  '[Organization Hierarchies API] Load Groups Success',
  payload<{ nodeTree: NodeTree }>()
);
