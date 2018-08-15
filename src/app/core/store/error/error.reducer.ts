import { HttpError } from '../../../models/http-error/http-error.model';
import { ErrorGroupTypes, Http5XXError } from './error.actions';

export interface ErrorState {
  current: HttpError;
  type: string;
}

export const initialState: ErrorState = {
  current: undefined,
  type: undefined,
};

export function errorReducer(state = initialState, action: Http5XXError): ErrorState {
  switch (action.errorGroup) {
    case ErrorGroupTypes.Http5XXError: {
      return { ...state, current: action.error, type: action.type };
    }
  }
  return state;
}
