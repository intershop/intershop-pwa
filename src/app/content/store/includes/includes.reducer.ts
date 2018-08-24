import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ContentInclude } from '../../../models/content-include/content-include.model';

import { IncludesAction, IncludesActionTypes } from './includes.actions';

export const includesAdapter = createEntityAdapter<ContentInclude>({
  selectId: contentInclude => contentInclude.id,
});

export interface IncludesState extends EntityState<ContentInclude> {
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
      const loadedInclude = action.payload;

      return {
        ...includesAdapter.upsertOne(loadedInclude, state),
        loading: false,
      };
    }
  }

  return state;
}
