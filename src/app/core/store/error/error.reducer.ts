import { ROUTER_NAVIGATION, RouterAction } from '@ngrx/router-store';
import { HttpError } from './error.actions';
export interface ErrorState {
  current: Error | null;
  type: String;
}

export const initialState: ErrorState = {
  current: null,
  type: null
};

export function generalErrorReducer(
  state = initialState,
  action: HttpError | RouterAction<any>
): ErrorState {
  const httpAction = action as HttpError;
  switch (httpAction.errorGroup) {
    case '5XX': {
      return { ...state, current: httpAction.error, type: httpAction.type };
    }
  }
  if (action.type === ROUTER_NAVIGATION) {
    const routerAction = action as RouterAction<any>;
    if (routerAction.payload.routerState.url !== '/error') {
      // TODO: something user friendly
      return initialState;
    }
  }
  return state;
}



