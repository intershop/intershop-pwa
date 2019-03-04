import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ContentEntryPoint } from 'ish-core/models/content-entry-point/content-entry-point.model';

import { IncludesAction, IncludesActionTypes } from './includes.actions';

export const includesAdapter = createEntityAdapter<ContentEntryPoint>({
  selectId: contentInclude => contentInclude.id,
});

export interface IncludesState extends EntityState<ContentEntryPoint> {
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
