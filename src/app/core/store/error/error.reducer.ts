import { EntityState } from '@ngrx/entity';
import { ErrorAction, ErrorActionTypes } from './error.actions';
export interface ErrorState extends EntityState<Error> {
  current: Error | null;
  type: String;
}

export const initialState: ErrorState = { current: null } as ErrorState;

export const getCurrent = (state: ErrorState) => state.current;


export function generalErrorReducer(
  state = initialState,
  action: ErrorAction
): ErrorState {
  switch (action.type) {
    case ErrorActionTypes.timeoutError: {

      return { ...state, current: action.error, type: action.type };
    }
  }
  return state;
}
