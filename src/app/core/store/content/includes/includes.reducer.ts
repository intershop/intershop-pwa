import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';

import { IncludesAction, IncludesActionTypes } from './includes.actions';

export const includesAdapter = createEntityAdapter<ContentPageletEntryPoint>({
  selectId: contentInclude => contentInclude.id,
});

export interface IncludesState extends EntityState<ContentPageletEntryPoint> {
  loading: boolean;
}

export const initialState: IncludesState = includesAdapter.getInitialState({
  loading: false,
});

export function includesReducer(state = initialState, action: IncludesAction): IncludesState {
  switch (action.type) {
    case IncludesActionTypes.LoadContentInclude: {
      return {
        ...state,
        loading: true,
      };
    }

    case IncludesActionTypes.LoadContentIncludeFail: {
      return {
        ...state,
        loading: false,
      };
    }

    case IncludesActionTypes.LoadContentIncludeSuccess: {
      const { include } = action.payload;

      return {
        ...includesAdapter.upsertOne(include, state),
        loading: false,
      };
    }
  }

  return state;
}
