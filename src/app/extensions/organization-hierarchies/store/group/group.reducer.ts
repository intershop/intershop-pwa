import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

import { loadGroupsSuccess } from './group.actions';

export const groupAdapter = createEntityAdapter<OrganizationGroup>();

export interface GroupState extends EntityState<OrganizationGroup> {}

const initialState: GroupState = groupAdapter.getInitialState({});

export const groupReducer = createReducer(
  initialState,
  on(loadGroupsSuccess, (state: GroupState, action) => {
    const { groups } = action.payload;
    return {
      ...groupAdapter.upsertMany(groups, state),
    };
  })
);
