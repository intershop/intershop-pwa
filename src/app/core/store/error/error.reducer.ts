import { RouterAction } from '@ngrx/router-store';
import { ErrorGroupTypes, HttpError } from './error.actions';
export interface ErrorState {
  current: Error | null;
  type: String;
}

export const initialState: ErrorState = {
  current: null,
  type: null
};

export function errorReducer(
  state = initialState,
  action: HttpError | RouterAction<any>
): ErrorState {
  const httpAction = action as HttpError;
  switch (httpAction.errorGroup) {
    case ErrorGroupTypes.Http5XXError: {
      return { ...state, current: httpAction.error, type: httpAction.type };
    }
  }
  return state;
}
