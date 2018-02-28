import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ErrorAction, ErrorActionTypes, GeneralError } from './error.actions';

export interface Error {
  id: number;
  payload: any;
}

export interface ErrorState extends EntityState<Error> {
  current: number | null;
}



export const adapter: EntityAdapter<Error> = createEntityAdapter<Error>({
  selectId: e => e.id
});

export const getCurrent = (state: ErrorState) => (state.entities && state.current) ? state.entities[state.current] : null;



export const {
  selectAll: getAvailable
} = adapter.getSelectors();

export const initialState: ErrorState = adapter.getInitialState({
  current: null,

});

export function generalErrorReducer(
  state = initialState,
  action: ErrorAction
): ErrorState {
  switch (action.type) {
    case ErrorActionTypes.timeoutError: {
      const idx = action.error.id;
      state = { ...state, current: idx };
      return adapter.addOne(action.error, state);
    }
  }
  return state;
}
