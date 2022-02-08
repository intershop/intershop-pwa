import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';

import { loadContentIncludeSuccess } from './includes.actions';

export const includesAdapter = createEntityAdapter<ContentPageletEntryPoint>({
  selectId: contentInclude => contentInclude.id,
});

export type IncludesState = EntityState<ContentPageletEntryPoint>;

const initialState: IncludesState = includesAdapter.getInitialState({});

export const includesReducer = createReducer(
  initialState,
  on(loadContentIncludeSuccess, (state, action) => {
    const { include } = action.payload;

    return {
      ...includesAdapter.upsertOne(include, state),
    };
  })
);
